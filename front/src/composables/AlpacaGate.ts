import Gate from "./Gate";
import useStore from "@/stores/main";

class AlpacaGate extends Gate {
  constructor(url: string) {
    super(url);
  }

  onConnect() {
    this.socket.on("connect", () => {
      console.log("connected to server");
    });
  }

  onData() {
    const store = useStore();
    const currentAsset = store.currentAsset;
    this.socket.on("data", (data: any) => {
      console.log(data);
      const type = data.T;
      if (type === "q") currentAsset.quotes.push(data);
      if (type === "b") currentAsset.bars.push(data);
      if (type === "t") currentAsset.trades.push(data);
      if (type === "historycalBars")
        currentAsset.historicalBars.push(data.bars);
    });
  }

  onBackTesting() {
    const store = useStore();
    const backTesting = store.backTesting;
    this.socket.on("backtesting", (data: any) => {
      console.log("backtesting");
      backTesting.data.push(data);
    });
  }
}
export default AlpacaGate;
