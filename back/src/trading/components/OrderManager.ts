import { Order, Action, Status, OrderWrapper } from "../../types/order";
import { SIM_STRING } from "../../config/config";
import useGetOrderById from "../../utility/useGetOrderById";
import Denque from "denque";

class OrderManager {
  orders: Order[];
  order_id: number;
  ts_2_om: Denque;
  om_2_gw: Denque;
  gw_2_om: Denque;
  om_2_ts: Denque;

  /**
   * Creates an instance of OrderManager.
   * @param {*} [ts_2_om=null]
   * @param {*} [om_2_ts=null]
   * @param {*} [om_2_gw=null]
   * @param {*} [gw_2_om=null]
   * @memberof OrderManager
   */
  constructor(
    ts_2_om: any = null,
    om_2_ts: any = null,
    om_2_gw: any = null,
    gw_2_om: any = null
  ) {
    this.orders = [];
    this.order_id = 0;
    this.ts_2_om = ts_2_om;
    this.om_2_gw = om_2_gw;
    this.gw_2_om = gw_2_om;
    this.om_2_ts = om_2_ts;
  }

  /**
   * @description Check if there is an order in the channel, if yes,
   * the order is removed and we handle_order_from_tradinig_strategy is called
   * @memberof OrderManager
   */
  handle_input_from_ts() {
    if (this.ts_2_om !== null) {
      if (this.ts_2_om.length > 0) {
        this.handle_order_from_ts(this.ts_2_om.shift());
      }
    } else {
      console.log(SIM_STRING);
    }
  }

  /**
   * @description get a copy of the received order and store it into a list of orders
   * @param {Order} order
   * @memberof OrderManager
   */
  handle_order_from_ts(order: Order | null = null) {
    if (this.check_order_valid(order)) {
      order = this.create_new_order({ ...(order as Order) });
      this.orders.push(order);
      if (this.om_2_gw === null) {
        console.log(SIM_STRING);
      } else {
        this.om_2_gw.push({ ...order });
      }
    }
  }

  /**
   * @description if an order is available in gw_2_om channel, calls handle_order_from_gateway
   * @memberof OrderManager
   */
  handle_input_from_market() {
    if (this.gw_2_om !== null) {
      if (this.gw_2_om.length > 0) {
        this.handle_order_from_gateway(this.gw_2_om.shift());
      }
    } else {
      console.log(SIM_STRING);
    }
  }

  /**
   * @description look up in the list of orders created by
   * the handle_order_from_trading_strategy function.
   * If the market response corresponds to an order in the list,
   * market response is considered valid else an error is raised
   * @param {Order} order_update
   * @memberof OrderManager
   */
  handle_order_from_gateway(order_update: Order) {
    const order = this.search_order(order_update.id)?.order;
    if (order !== undefined) {
      order.status = order_update.status;
      if (this.om_2_ts !== null) {
        this.om_2_ts.push({ ...order });
      } else {
        console.log(SIM_STRING);
      }
      this.clean_traded_orders();
    } else {
      console.log("order not found");
    }
  }

  /**
   * @description check if the order is valid (quantity and price are positive)
   * @param {(Order | null)} order
   * @return {*}  {boolean}
   * @memberof OrderManager
   */
  check_order_valid(order: Order | null): boolean {
    if (!order) return false;
    if (order.quantity < 0) {
      return false;
    }
    if (order.price < 0) {
      return false;
    }
    return true;
  }

  /**
   * @description create a new order with a new id
   * @param {Order} order
   * @return {*}  {Order}
   * @memberof OrderManager
   */
  create_new_order(order: Order): Order {
    this.order_id++;
    return {
      id: this.order_id,
      price: order.price,
      quantity: order.quantity,
      side: order.side,
      status: Status.NEW,
      action: Action.NEW,
    } as Order;
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
   * @description remove from the list of orders all the orders that have been filled
   * @memberof OrderManager
   */
  clean_traded_orders() {
    const order_offsets: Order[] = [];
    this.orders.forEach((order, key) => {
      if (order.status === Status.FILLED) {
        order_offsets.push(order);
      }
    });
    if (order_offsets.length > 0) {
      order_offsets.forEach((offset, key) => {
        this.orders.splice(key, 1);
      });
    }
  }
}
export default OrderManager;
