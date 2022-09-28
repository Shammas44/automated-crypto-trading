import { Order, OrderWrapper, Action, Status } from "../../types/order";
import useGetOrderById from "../../utility/useGetOrderById";
import { SIM_STRING } from "../../config/config";
import Denque from "denque";

class MarketSimulator {
  orders: Order[];
  om_2_gw: Denque;
  gw_2_om: Denque;

  constructor(om_2_gw: any = null, gw_2_om: any = null) {
    this.orders = [];
    this.om_2_gw = om_2_gw;
    this.gw_2_om = gw_2_om;
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
   * @description collect order from the order manager through the om_2_gw channel
   * @memberof MarketSimulator
   */
  handle_order_from_gw() {
    if (this.gw_2_om !== null) {
      console.log("om_2_gw", this.om_2_gw);
      if (this.om_2_gw.length > 0) {
        this.handle_order(this.om_2_gw.shift());
      }
    } else {
      console.log(SIM_STRING);
    }
  }

  /**
   * @description push an order to the gw_2_om channel and log a message
   * @private
   * @param {Order} order
   * @param {string} [status_message]
   * @memberof MarketSimulator
   */
  private push_order_to_gw_2_om(order: Order, status_message?: string) {
    this.gw_2_om !== null
      ? this.gw_2_om.push({ ...order })
      : console.log(SIM_STRING);
    if (status_message) console.log(status_message);
  }

  /**
   * @description accept any new orders.
   * If an order already has the same order ID, the order will be dropped.
   * If the order manager cancels or amends an order, the order is automatically canceled and amended.
   * @param {Order} order
   * @memberof MarketSimulator
   */
  handle_order(order: Order) {
    const handle_undefined = (classInstance: this) => {
      if (order.action === Action.NEW) {
        order.status = Status.ACCEPTED;
        classInstance.orders.push(order);
        classInstance.push_order_to_gw_2_om(order);
      } else if (
        order.action === Action.CANCEL ||
        order.action === Action.AMEND
      ) {
        classInstance.push_order_to_gw_2_om(
          order,
          "Order id - not found - Rejection"
        );
      }
    };

    const handle_defined = (classInstance: this, o: Order, offset: number) => {
      if (order.action === Action.NEW) {
        console.log("Duplicate order id - Rejection");
      } else if (order.action === Action.CANCEL) {
        o.status = Status.CANCELLED;
        classInstance.push_order_to_gw_2_om(order, "Order cancelled");
        classInstance.orders.splice(offset, 1);
      } else if (order.action === Action.AMEND) {
        o.status = Status.ACCEPTED;
        classInstance.push_order_to_gw_2_om(o, "Order amended");
      }
    };

    const order_wrapper = this.search_order(order.id);
    const [o, offset] = [order_wrapper?.order, order_wrapper?.position];
    if (o && offset) {
      handle_defined(this, o, offset);
    } else {
      handle_undefined(this);
    }
  }

  /**
   * @description filled and removed all present orders in orders list
   * @memberof MarketSimulator
   */
  fill_all_orders() {
    const orders_to_be_removed: number[] = [];
    this.orders.forEach((order, index) => {
      order.status = Status.FILLED;
      orders_to_be_removed.push(index);
      if (this.gw_2_om !== null) {
        this.gw_2_om.push({ ...order });
      } else {
        console.log(SIM_STRING);
      }
    });
    orders_to_be_removed.forEach((index) => {
      this.orders.splice(index, 1);
    });
  }
}
export default MarketSimulator;
