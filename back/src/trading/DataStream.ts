import Alpaca from "@alpacahq/alpaca-trade-api";
import { DataStreamParameters, AssetsKind } from "./backTesting";
import { EmitData } from "../types/order";
import {
  CryptoBar,
  CryptoQuote,
  CryptoTrade,
} from "@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2";

class DataStream {
  alpaca: Alpaca;
  exchanges: string;
  symbol: string;
  emitData: EmitData;

  constructor({
    keyId: apiKey,
    secretKey,
    paper,
    exchanges,
    symbol,
    emitData,
  }: DataStreamParameters) {
    const alpaca = new Alpaca({
      keyId: apiKey,
      secretKey,
      paper,
      feed: "iex",
      exchanges: exchanges,
    });
    this.alpaca = alpaca;
    this.exchanges = exchanges;
    this.symbol = symbol;
    this.emitData = emitData;
  }

  async getHistoricalData(
    action: AssetsKind,
    end: string,
    hoursCount: number = 6
  ) {
    const start = new Date(Date.now() - hoursCount * 3600 * 1000).toISOString();
    const options = {
      start: start,
      end: end,
      timeframe: "1Min",
      exchanges: this.exchanges,
    };
    let assets = [];
    let resp;
    if (action === AssetsKind.BAR) resp = this.getCryptoBars(options);
    if (action === AssetsKind.QUOTE) resp = this.getCryptoQuotes(options);
    if (action === AssetsKind.TRADE) resp = this.getCryptoTrades(options);
    if (resp) {
      for await (let bar of resp) {
        assets.push(bar);
      }
      return assets;
    }
  }

  getCryptoBars(options: any) {
    return this.alpaca.getCryptoBars(this.symbol, options);
  }

  getCryptoQuotes(options: any) {
    const newOptions: any = {};
    Object.entries(options).forEach(([key, value]) => {
      if (key !== "timeframe") newOptions[key] = value;
    });
    return this.alpaca.getCryptoQuotes(this.symbol, newOptions);
  }

  getCryptoTrades(options: any) {
    return this.alpaca.getCryptoTrades(this.symbol, options);
  }

  disconnect() {
    const socket = this.alpaca.crypto_stream_v2;
    socket.disconnect();
  }

  getSocket() {
    return this.alpaca.crypto_stream_v2;
  }

  unsubscribe() {
    const socket = this.alpaca.crypto_stream_v2;
    const dataStreamInstance = this;
    socket.unsubscribe({
      quotes: [dataStreamInstance.symbol],
      trades: [dataStreamInstance.symbol],
      bars: [dataStreamInstance.symbol],
    });
  }

  async onFirstConnect(dataName: string) {
    const dataStreamInstance = this;
    const socket = this.alpaca.crypto_stream_v2;

    socket.onConnect(async function () {
      console.log("Connected to socket");
      socket.subscribe({
        quotes: [dataStreamInstance.symbol],
        trades: [dataStreamInstance.symbol],
        bars: [dataStreamInstance.symbol],
      });
    });

    socket.onError((err: any) => {
      console.log("error", err);
    });

    socket.onCryptoTrade((trade: CryptoTrade) => {
      // console.log(trade);
      this.emitData(dataName, trade);
    });

    socket.onCryptoQuote((quote: CryptoQuote) => {
      this.emitData(dataName, quote);
    });

    socket.onCryptoBar((bar: CryptoBar) => {
      try {
        this.emitData(dataName, bar);
      } catch (error) {
        console.log("error", error);
      }
    });

    socket.onDisconnect(() => {
      console.log("Disconnected");
    });

    socket.connect();
  }
}
export default DataStream;
