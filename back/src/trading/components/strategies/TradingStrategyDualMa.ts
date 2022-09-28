import Denque from "denque";
import {
  Action,
  Status,
  Side,
  BookEvent,
  OrderWrapper,
  TradingParameters,
} from "../../../types/order";
import { sum } from "mathjs";
import { SIM_STRING } from "../../../config/config";
import TradingStrategy from "../TradingStrategy";

function average(list: Denque) {
  const array: number[] = list.toArray();
  return sum(array) / array.length;
}

class TradingStrategyDualMa extends TradingStrategy {
  paper_position: number;
  paper_pnl: number;
  paper_cash: number;
  paper_holdings: number;
  paper_total: number;
  long_signal: boolean;
  total: number;
  holdings: number;
  small_window: Denque;
  large_window: Denque;
  list_position: number[];
  list_cash: number[];
  list_holdings: number[];
  list_total: any[];
  list_paper_position: number[];
  list_paper_cash: number[];
  list_paper_holdings: number[];
  list_paper_total: number[];

  constructor(tradingParameters: TradingParameters) {
    super(tradingParameters);
    this.orders = [];
    this.order_id = 0;
    this.position = 0;
    this.pnl = 0;
    this.cash = 10000;
    this.paper_position = 0;
    this.paper_pnl = 0;
    this.paper_cash = 10000;
    this.paper_holdings = 0;
    this.paper_total = 0;
    this.current_bid = 0;
    this.current_ask = 0;
    this.ob_2_ts = this.ob_2_ts;
    this.ts_2_om = this.ts_2_om;
    this.om_2_ts = this.om_2_ts;
    this.long_signal = false;
    this.total = 0;
    this.holdings = 0;
    this.small_window = new Denque();
    this.large_window = new Denque();
    this.list_position = [];
    this.list_cash = [];
    this.list_holdings = [];
    this.list_total = [];
    this.list_paper_position = [];
    this.list_paper_cash = [];
    this.list_paper_holdings = [];
    this.list_paper_total = [];
  }

  override create_metrics_out_of_prices(price_update: any) {
    this.small_window.push(price_update["price"]);
    this.large_window.push(price_update["price"]);
    if (this.small_window.length > 50) {
      this.small_window.shift();
    }
    if (this.large_window.length > 100) {
      this.large_window.shift();
    }
    if (this.small_window.length === 50) {
      average(this.small_window) > average(this.large_window)
        ? (this.long_signal = true)
        : (this.long_signal = false);
      return true;
    }
    return false;
  }

  override buy_sell_or_hold_something(book_event: BookEvent) {
    if (this.long_signal && this.paper_position <= 0) {
      this.create_orders(book_event, book_event.bid_quantity);
      this.paper_position += book_event.bid_quantity;
      this.paper_cash -= book_event.bid_quantity * book_event.bid_price;
    } else if (this.paper_position > 0 && !this.long_signal) {
      this.create_orders(book_event, book_event.bid_quantity);
      this.paper_position -= book_event.bid_quantity;
      this.paper_cash -= book_event.bid_quantity * book_event.bid_price;
    }
    this.paper_holdings = this.paper_position * book_event.bid_price;
    this.paper_total = this.paper_holdings + this.paper_cash;
    this.list_paper_position.push(this.paper_position);
    this.list_paper_cash.push(this.paper_cash);
    this.list_paper_holdings.push(this.paper_holdings);
    this.list_paper_total.push(this.paper_holdings + this.paper_cash);

    this.list_position.push(this.position);
    this.holdings = this.position * book_event.bid_price;
    this.list_holdings.push(this.holdings);
    this.list_cash.push(this.cash);
    this.list_total.push(this.holdings + this.cash);
  }

  override signal(book_event: BookEvent | null): boolean {
    if (!book_event) return false;
    if (book_event.bid_quantity != -1 && book_event.ask_quantity != -1) {
      return true;
    } else {
      return false;
    }
  }

  override handle_book_event(book_event: BookEvent) {
    if (book_event) {
      this.current_bid = book_event.bid_price;
      this.current_ask = book_event.ask_price;
      const signal = this.signal(book_event);
      if (signal) {
        this.create_metrics_out_of_prices(book_event.bid_price);
        this.buy_sell_or_hold_something(book_event);
      }
      this.execution();
    }
  }

  override execution() {
    const orders_to_be_removed: number[] = [];
    this.orders.forEach((order, key) => {
      if (order.action == Action.SEND) {
        order.status = Status.NEW;
        order.action = Action.NONE;
        if (this.ts_2_om === null) {
          console.log(SIM_STRING);
        } else {
          this.ts_2_om.push({ ...order });
        }
      }
      if (
        order.status === Status.REJECTED ||
        order.status === Status.CANCELLED
      ) {
        orders_to_be_removed.push(key);
      }
      if (order.status === Status.FILLED) {
        orders_to_be_removed.push(key);
        const pos = order.side === Side.BUY ? order.quantity : -order.quantity;
        this.position += pos;
        this.holdings = this.position * order.price;
        this.pnl -= pos * order.price;
        this.cash -= pos * order.price;

        orders_to_be_removed.forEach((index: number) => {
          this.orders.splice(index, 1);
        });
      }
    });
  }

  override handle_market_response(order_execution: any) {
    console.log(order_execution);
    const orderWrapper = this.search_order(order_execution.id) as OrderWrapper;
    const order = orderWrapper.order;
    if (!order) {
      console.log("error not found");
      return;
    }
    order.status = order_execution.status;
    this.execution();
  }
}
export default TradingStrategyDualMa;
