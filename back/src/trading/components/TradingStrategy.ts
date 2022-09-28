import {
  Order,
  BookEvent,
  Side,
  Action,
  Status,
  OrderWrapper,
  TradingStrategyFeatures,
  TradingParameters,
} from "../../types/order";
import { SIM_STRING } from "../../config/config";
import useGetOrderById from "../../utility/useGetOrderById";
import Denque from "denque";

class TradingStrategy implements TradingStrategyFeatures {
  orders: Order[];
  order_id: number;
  position: number;
  pnl: number;
  cash: number;
  current_bid: number;
  current_ask: number;
  ob_2_ts: Denque | null;
  ts_2_om: Denque | null;
  om_2_ts: Denque | null;

  /**
   * Creates an instance of TradingStrategy.
   * @param {(TradingParameters | null)} [args=null]
   * @memberof TradingStrategy
   */
  constructor(args: TradingParameters | null = null) {
    this.orders = [];
    this.order_id = 0;
    this.position = 0;
    this.pnl = 0;
    this.cash = 10000;
    this.current_bid = 0;
    this.current_ask = 0;
    this.ob_2_ts = args?.ob_2_ts ?? null;
    this.ts_2_om = args?.ts_2_om ?? null;
    this.om_2_ts = args?.om_2_ts ?? null;
  }

  /**
   * @description check if there is book event in dequeue, if yes, execute handle_book_event
   * @param {(BookEvent | null)} [book_event=null]
   * @memberof TradingStrategy
   */
  handle_input_from_ob(book_event: BookEvent | null = null): void {
    if (this.ob_2_ts === null) {
      console.log(SIM_STRING);
      this.handle_book_event(book_event);
    } else {
      if (this.ob_2_ts.length > 0) {
        // TODO: Fix this ligne, it shouldn't return a Denque
        const book_event: BookEvent = this.ob_2_ts.shift();
        this.handle_book_event(book_event);
        this.handle_book_event();
      }
    }
  }

  /**
   * @description if signal is true, create orders and execute them
   * @param {BookEvent} book_event
   * @memberof TradingStrategy
   */
  handle_book_event(book_event: BookEvent | null = null) {
    if (book_event !== null) {
      this.current_bid = book_event["bid_price"];
      this.current_ask = book_event["ask_price"];
      if (this.signal(book_event)) {
        this.create_orders(
          book_event,
          Math.min(book_event["bid_quantity"], book_event["ask_quantity"])
        );
      }
    }
    this.execution();
  }

  /**
   * @description return true if bid price > ask price else return false
   * @param {(BookEvent | null)} book_event
   * @return {*}  {boolean}
   * @memberof TradingStrategy
   */
  signal(book_event: BookEvent | null): boolean {
    if (book_event === null) return false;
    if (book_event["bid_price"] < book_event["ask_price"]) return false;
    if (book_event["bid_price"] > 0 && book_event["ask_price"] > 0) return true;
    return false;
  }

  /**
   * @description execute available orders and remove deprecated orders
   * @memberof TradingStrategy
   */
  execution() {
    const orders_to_be_removed: number[] = [];
    this.orders.forEach((order: Order, order_index: number) => {
      if (order["action"] === Action.SEND) {
        order["status"] = Status.NEW;
        order["action"] = Action.NONE;
        this.ts_2_om === null
          ? console.log(SIM_STRING)
          : this.ts_2_om.push({ ...order });
      }
      if (order["status"] === Status.REJECTED)
        orders_to_be_removed.push(order_index);
      if (order["status"] === Status.FILLED) {
        orders_to_be_removed.push(order_index);
        const position =
          order["side"] === Side.BUY ? order["quantity"] : -order["quantity"];
        this.position += position;
        this.pnl -= position * order["price"];
        this.cash -= position * order["price"];
      }
    });
    // TODO: verify this chunk of code
    orders_to_be_removed.forEach((index: number) => {
      this.orders.splice(index, 1);
    });
  }

  /**
   * @description create a buy and a sell order for a same item
   * @param {BookEvent} book_event
   * @param {number} quantity
   * @memberof TradingStrategy
   */
  create_orders(book_event: BookEvent, quantity: number) {
    this.order_id++;
    const sell_order: Order = {
      id: this.order_id,
      price: book_event["bid_price"],
      quantity: quantity,
      side: Side.SELL,
      action: Action.SEND,
      timestamp: Date.now(),
    };

    this.orders.push({ ...sell_order });
    this.order_id++;

    const buy_order: Order = { ...sell_order };
    buy_order.id = this.order_id;
    buy_order.price = book_event["ask_price"];
    buy_order.side = Side.BUY;

    this.orders.push({ ...buy_order });
  }

  /**
   * @description collect information form order manager and update trading strategy
   * @memberof TradingStrategy
   */
  handle_response_from_om() {
    this.om_2_ts !== null
      ? this.handle_market_response(this.om_2_ts.shift())
      : console.log(SIM_STRING);
  }

  /**
   * @description
   * @param {Order} order_execution
   * @return {*}  {void}
   * @memberof TradingStrategy
   */
  handle_market_response(order_execution: Order): void {
    const order = this.search_order(order_execution.id)?.order;
    if (order === undefined) {
      console.log("order not found");
      return;
    }
    order.status = order_execution.status;
    this.execution();
  }

  /**
   * @description return the order if it exists
   * @param {number} id
   * @return {OrderWrapper | null}
   * @memberof LiquidityProvider
   */
  search_order(id: number): OrderWrapper | null {
    return useGetOrderById(this.orders, id);
  }

  /**
   * @description
   * @return {number}
   * @memberof TradingStrategy
   */
  get_pnl(): number {
    return (
      this.pnl + (this.position * (this.current_bid + this.current_ask)) / 2
    );
  }

  /**
   * @description Need to be overrided in each class implementing TradingStrategy
   * @param {BookEvent} book_event
   * @memberof TradingStrategy
   */
  buy_sell_or_hold_something(book_event: BookEvent): void {}

  /**
   * @description Need to be overrided in each class implementing TradingStrategy
   * @param {*} price_update
   * @memberof TradingStrategy
   */
  create_metrics_out_of_prices(price_update: any): void {}
}
export default TradingStrategy;
