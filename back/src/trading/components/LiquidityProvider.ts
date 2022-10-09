const rand = require("random-seed");
import { Order, OrderWrapper, Action, Side } from "../../types/order";
import { SIM_STRING } from "../../config/config";
import useGetOrderById from "../../utility/useGetOrderById";
import Denque from "denque";

class LiquidityProvider {
  /** @property {Denque} lp_2_gateway - channel between LiquidityProvider and Gateway */
  lp_2_gateway: Denque;
  /** @property {Array<Order>} orders - Array of orders */
  orders: Order[];
  /** @property {number} order_id - last order id */
  order_id: number;
  /** @property {any} seed - TODO */
  seed: any;

  /**
   * It generates orders and sends them to the gateway
   * @param {(any | undefined)} [lp_2_gateway=undefined] - channel between liquidity provider and gateway
   */
  constructor(lp_2_gateway: any | undefined = undefined) {
    this.lp_2_gateway = lp_2_gateway;
    this.seed = rand.create("0");
    this.orders = [];
    this.order_id = 0;
  }

  /**
   * Return the order if it exists
   * @param {number} id
   * @return {OrderWrapper | null}
   */
  search_order(id: number): OrderWrapper | null {
    return useGetOrderById(this.orders, id);
  }

  /**
   * Insert an order in the array of orders
   * @param {Order} order
   * @return {void | Order}
   */
  insert_manual_order(order: Order): void | Order {
    if (this.lp_2_gateway === null) {
      console.log(SIM_STRING);
      return order;
    }
    this.lp_2_gateway.push({ ...order });
  }

  /**
   * Generate a random order and insert it in the array of orders
   * @return {*}
   */
  generate_random_order() {
    // TODO: verify this function
    const price = this.seed.intBetween(8, 12);
    const quantity = this.seed.intBetween(1, 10) * 100;
    const side = this.seed.intBetween(0, 1) === 0 ? Side.BUY : Side.SELL;
    const id = this.seed.intBetween(0, this.order_id + 1);
    const timestamp = Date.now();
    const orderWrapper = this.search_order(id);
    let action;
    let new_order = false;

    // TODO: verifiy the following line
    if (orderWrapper === null) {
      action = Action.NEW;
      new_order = true;
    } else {
      action = this.seed.intBetween(0, 1) === 0 ? Action.UPDATE : Action.DELETE;
    }

    const order: Order = { id, price, quantity, side, action, timestamp };

    // WARNING: in initial script the condition is "!new_order"
    if (new_order) {
      this.order_id++;
      this.orders.push(order);
    }

    if (!this.lp_2_gateway) {
      console.log(SIM_STRING);
      return order;
    }

    this.lp_2_gateway.push({ ...order });
  }

  /**
   * TODO
   * @return {void}
   */
  read_tick_data_from_data_source(): void {
    //TODO: implement this function
    return;
  }
}
export default LiquidityProvider;
