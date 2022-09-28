import OrderManager from "../../trading/components/OrderManager";
import { Side, Status, Order } from "../../types/order";

function display_orders(orders: Order[]) {
  orders.forEach((order) => {
    console.log(order);
  });
}

function store_order_from_ts_into_orders_list(order_manager: OrderManager) {
  const order: Order = {
    id: 10,
    price: 219,
    quantity: 10,
    side: Side.BID,
    timestamp: Date.now(),
  };
  order_manager.handle_order_from_ts(order);
  expect(order_manager.orders.length).toEqual(1);
  order_manager.handle_order_from_ts(order);
  expect(order_manager.orders.length).toEqual(2);
  expect(order_manager.orders[0].id).toEqual(1);
  expect(order_manager.orders[1].id).toEqual(2);
}

describe("Receive order from trading strategy", () => {
  it("Newly created order(s) should be present in orders list", async () => {
    store_order_from_ts_into_orders_list(new OrderManager());
  });
});

describe("Receive order from trading strategy error", () => {
  it("Unvalid order should be remove from orders list", async () => {
    const order_manager = new OrderManager();
    const order: Order = {
      id: 10,
      price: -219,
      quantity: 10,
      side: Side.BID,
      timestamp: Date.now(),
    };
    order_manager.handle_order_from_ts(order);
    expect(order_manager.orders.length).toEqual(0);
  });
});

describe("Receive from gateway filled", () => {
  it("Newly created order(s) should be present in orders list", async () => {
    const order_manager = new OrderManager();
    store_order_from_ts_into_orders_list(order_manager);
    const order: Order = {
      id: 2,
      price: 13,
      quantity: 10,
      side: Side.BID,
      status: Status.FILLED,
      timestamp: Date.now(),
    };
    // display_orders(order_manager.orders);
    order_manager.handle_order_from_gateway(order);
    expect(order_manager.orders.length).toEqual(1);
  });
});

describe("Receive from gateway acked", () => {
  it("Should update already existing order", async () => {
    const order_manager = new OrderManager();
    store_order_from_ts_into_orders_list(order_manager);
    const order: Order = {
      id: 2,
      price: 13,
      quantity: 10,
      side: Side.BID,
      status: Status.ACKED,
      timestamp: Date.now(),
    };
    // display_orders(order_manager.orders);
    order_manager.handle_order_from_gateway(order);
    expect(order_manager.orders.length).toEqual(2);
    expect(order_manager.orders[1].status).toEqual(Status.ACKED);
  });
});
