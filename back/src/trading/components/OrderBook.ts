import Denque from "denque";
import { SIM_STRING } from "../../config/config";
import { Action, BookEvent, Order, Side } from "../../types/order";

class OrderBook {
  list_asks: Order[];
  list_bids: Order[];
  gw_2_ob: Denque | null;
  ob_to_ts: Denque | null;
  current_bid: Order | null;
  current_ask: Order | null;

  /**
   * Creates an instance of OrderBook.
   * @param {*} [gt_2_ob=null]
   * @param {*} [ob_2_ts=null]
   * @memberof OrderBook
   */
  constructor(gt_2_ob: Denque | null = null, ob_2_ts: Denque | null = null) {
    this.list_asks = [];
    this.list_bids = [];
    this.gw_2_ob = gt_2_ob;
    this.ob_to_ts = ob_2_ts;
    this.current_bid = null;
    this.current_ask = null;
  }

  /**
   * @description send order present gateway as param to handle_order
   * @param {(Order | null)} [order=null]
   * @memberof OrderBook
   */
  handle_order_from_gateway(order: Order | null = null): void {
    if (this.gw_2_ob === null) {
      console.log(SIM_STRING);
      this.handle_order(order);
    } else if (this.gw_2_ob.length > 0) {
      const order_from_gw = this.gw_2_ob.shift();
      this.handle_order(order_from_gw);
    }
  }

  /**
   * @description decide what to do with order
   * @param {(Order | null)} order
   * @return {*}  {(BookEvent | undefined)}
   * @memberof OrderBook
   */
  handle_order(order: Order | null): BookEvent | undefined {
    if (!order) {
      return this.check_generate_top_of_book_event();
    }
    if (order.action === Action.NEW) {
      this.handle_new(order);
    } else if (order.action === Action.MODIFY) {
      this.handle_modify(order);
    } else if (order.action === Action.DELETE) {
      this.handle_delete(order);
    } else {
      console.log("Error-Cannot handle this action");
    }
    return this.check_generate_top_of_book_event();
  }

  /**
   * @description modify order quantity
   * @param {Order} o
   * @return {*}  {null}
   * @memberof OrderBook
   */
  handle_modify(o: Order): null {
    const order = this.find_order_in_a_list(o);
    if (order === null) return null;
    order.quantity > o.quantity
      ? (order.quantity = o.quantity)
      : console.log(SIM_STRING);
    return null;
  }

  /**
   * @description delete order from list
   * @param {Order} o
   * @return {*}  {null}
   * @memberof OrderBook
   */
  handle_delete(o: Order): null {
    const lookup_list = this.get_list(o);
    const order = this.find_order_in_a_list(o, lookup_list);
    if (order !== null && lookup_list !== null) {
      lookup_list.splice(lookup_list.indexOf(order), 1);
    }
    return null;
  }

  /**
   * @description
   * @param {Order} o
   * @return {*}  {(Order[] | null)}
   * @memberof OrderBook
   */
  get_list(o: Order): Order[] | null {
    let lookup_list;
    if (o.side) {
      if (o.side === Side.BID) {
        lookup_list = this.list_bids;
      } else if (o.side === Side.ASK) {
        lookup_list = this.list_asks;
      } else {
        console.log("incorrect side");
        return null;
      }
      return lookup_list;
    } else {
      for (const order of this.list_bids) {
        if (order.id === o.id) return this.list_bids;
      }
      for (const order of this.list_asks) {
        if (order.id === o.id) return this.list_asks;
      }
      return null;
    }
  }

  /**
   * @description return order if found in list
   * @param {Order} o
   * @param {(Order[] | null)} [lookup_list=null]
   * @return {*}  {(Order | null)}
   * @memberof OrderBook
   */
  find_order_in_a_list(
    o: Order,
    lookup_list: Order[] | null = null
  ): Order | null {
    if (lookup_list === null) {
      lookup_list = this.get_list(o);
    }
    if (lookup_list !== null) {
      for (const order of lookup_list) {
        if (order.id === o.id) return order;
      }
      console.log(`order not found id = ${o.id}`);
    }
    return null;
  }

  /**
   * @description return a newly created BookEvent
   * @param {(Order | null)} bid
   * @param {(Order | null)} ask
   * @return {*}
   * @memberof OrderBook
   */
  create_book_event(bid: Order | null, ask: Order | null): BookEvent {
    return {
      bid_price: bid ? bid.price : -1,
      bid_quantity: bid ? bid.quantity : -1,
      ask_price: ask ? ask.price : -1,
      ask_quantity: ask ? ask.quantity : -1,
    } as BookEvent;
  }

  /**
   * @description push order to appropriate list and sort it
   * @param {Order} order
   * @memberof OrderBook
   */
  handle_new(order: Order): void {
    if (order.side === Side.BID) {
      this.list_bids.push(order);
      // sorted by price desc
      this.list_bids.sort((a, b) => b.price - a.price);
    } else if (order.side === Side.ASK) {
      this.list_asks.push(order);
      // sorted by price asc
      this.list_asks.sort((a, b) => a.price - b.price);
    }
  }

  /**
   * @description set current_ask and current_bid based on order book
   * @return {*}  {(BookEvent | undefined)}
   * @memberof OrderBook
   */
  check_generate_top_of_book_event(): BookEvent | undefined {
    let tob_changed = false,
      book_event,
      current_list;

    current_list = this.list_bids;
    if (current_list.length === 0) {
      if (this.current_bid !== null) {
        tob_changed = true;
        this.current_bid = null;
      }
    } else {
      if (this.current_bid !== current_list[0]) {
        tob_changed = true;
        this.current_bid = current_list[0];
      }
    }

    current_list = this.list_asks;
    if (current_list.length === 0) {
      if (this.current_ask !== null) {
        tob_changed = true;
        this.current_ask = null;
      }
    } else {
      if (this.current_ask !== current_list[0]) {
        tob_changed = true;
        this.current_ask = current_list[0];
      }
    }

    if (tob_changed === true)
      book_event = this.create_book_event(this.current_bid, this.current_ask);
    if (this.ob_to_ts !== null) {
      this.ob_to_ts.push(book_event);
    } else {
      return book_event;
    }
  }

  /**
   * @description dsiplay order book content
   * @memberof OrderBook
   */
  display_content(): void {
    console.log("BIDS");
    this.list_bids.forEach((order) => {
      console.log(`${order.id} ${order.price} ${order.quantity}`);
    });
    console.log("ASKS");
    this.list_asks.forEach((order) => {
      console.log(`${order.id} ${order.price} ${order.quantity}`);
    });
  }
}
export default OrderBook;
