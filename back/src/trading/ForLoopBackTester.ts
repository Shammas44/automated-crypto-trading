import DataStream from "./DataStream";
import Denque from "denque";
import { Socket } from "socket.io";
import fs from "fs";
import { sum } from "mathjs";
import { AssetsKind } from "./backTesting";
import { performance } from "perf_hooks";
import { msToHMS } from "../utility/utility";

class ForLoopBackTester {
  private file_name: string;
  private data_stream: DataStream | null;

  private small_window: Denque;
  private large_window: Denque;
  private list_position: any;
  private list_cash: any;
  private list_holdings: any;
  private list_total: any;
  private long_signal: boolean;
  private position: number;
  private cash: number;
  private total: number;
  private holdings: number;
  private socket: Socket;

  constructor(data_stream: DataStream | null, socket: any, file_name: string) {
    this.socket = socket;
    this.file_name = file_name;
    this.data_stream = data_stream;
    this.small_window = new Denque();
    this.large_window = new Denque();
    this.list_position = [];
    this.list_cash = [];
    this.list_holdings = [];
    this.list_total = [];
    this.long_signal = false;
    this.position = 0;
    this.cash = 500;
    this.total = 0;
    this.holdings = 0;
  }

  average(list: Denque) {
    const array: number[] = list.toArray();
    return sum(array) / array.length;
  }

  async load_financial_data(): Promise<string> {
    var startTime = performance.now();
    const file_path = `./data/${this.file_name}`;
    try {
      const data = fs.readFileSync(file_path, "utf8");
      return data;
    } catch (error) {
      const historical_data = await this.data_stream?.getHistoricalData(
        AssetsKind.BAR,
        new Date().toISOString(),
        500
      );
      const jsonData = JSON.stringify(historical_data);
      await this.writeFile(file_path, jsonData);
      var endTime = performance.now();
      msToHMS(endTime - startTime);
      return jsonData;
    }
  }

  async writeFile(file_path: string, data: string) {
    fs.writeFile(`.${file_path}`, data, function (err) {
      if (err) throw err;
      console.log("File Saved !");
    });
  }

  create_metrics_out_of_prices(price_update: any) {
    this.small_window.push(price_update["price"]);
    this.large_window.push(price_update["price"]);
    if (this.small_window.length > 50) {
      this.small_window.shift();
    }
    if (this.large_window.length > 100) {
      this.large_window.shift();
    }
    if (this.small_window.length === 50) {
      if (this.average(this.small_window) > this.average(this.large_window)) {
        this.long_signal = true;
      } else {
        this.long_signal = false;
      }
      return true;
    }
    return false;
  }

  buy_sell_or_hold_something(price_update: any) {
    const volume = 0.01;
    if (this.long_signal && this.position <= 0) {
      /* console.log( */
      /*   `${price_update["date"]} send buy order for ${volume} assets prices ${price_update["price"]}` */
      /* ); */
      this.position += volume;
      this.cash -= volume * price_update["price"];
    } else if (this.position > 0 && !this.long_signal) {
      /* console.log( */
      /*   `${price_update["date"]} send sell order for ${volume} asses prices ${price_update["price"]}` */
      /* ); */
      this.position -= volume;
      this.cash -= -volume * price_update["price"];
      this.holdings = this.position * price_update["price"];
      this.total = this.holdings + this.cash;
      /* console.log( */
      /*   `date: ${price_update["date"]}, total: ${this.total}, holdings: ${this.holdings}, cash: ${this.cash}` */
      /* ); */
      this.list_position.push(this.position);
      this.list_cash.push(this.cash);
      this.list_holdings.push(this.holdings);
      this.list_total.push({
        date: price_update["date"],
        price: this.holdings + this.cash,
      });
    }
  }

  run(data: string) {
    JSON.parse(data).forEach((element: any) => {
      const price_information = {
        date: element.Timestamp,
        price: element.Close,
      };
      const is_tradable = this.create_metrics_out_of_prices(price_information);
      if (is_tradable) this.buy_sell_or_hold_something(price_information);
    });

    return {
      label: "Holding + Cash",
      data: this.list_total,
    };
  }
}

export default ForLoopBackTester;
