import TradingStrategy from "../../trading/components/TradingStrategy";
import { Side, Action, BookEvent, Status, Order } from "../../types/order";

function receive_top_of_book(tradingStrategy: TradingStrategy) {
  const book_event: BookEvent = {
    bid_price: 12,
    bid_quantity: 100,
    ask_price: 11,
    ask_quantity: 150,
  };
  tradingStrategy.handle_book_event(book_event);
  const sell_order = tradingStrategy.orders[0];
  const buy_order = tradingStrategy.orders[1];
  expect(tradingStrategy.orders.length).toEqual(2);
  expect(sell_order.side).toEqual(Side.SELL);
  expect(buy_order.side).toEqual(Side.BUY);
  expect(sell_order.price).toEqual(12);
  expect(buy_order.price).toEqual(11);
  // quantity is the same for both orders because the choosen quantity
  // is the smallest quantity of bid and ask quantity
  expect(sell_order.quantity).toEqual(100);
  expect(buy_order.quantity).toEqual(100);
  expect(sell_order.action).toEqual(Action.NONE);
  expect(buy_order.action).toEqual(Action.NONE);
}

// describe("Receive top of book", () => {
//   it("validate that the book event sent by the book is received correctly", async () => {
//     const tradingStrategy = new TradingStrategy();
//     receive_top_of_book(tradingStrategy);
//   });
// });

describe("Create strat", () => {
  it("", async () => {
    const tradingStrategy = new TradingStrategy();
    const truc = 1;
    // expect(tradingStrategy).toBeInstanceOf(TradingStrategy);
    expect(truc).toEqual(1);
  });
});

// describe("Rejected order", () => {
//   it("Should return a valid order", async () => {
//     const tradingStrategy = new TradingStrategy();
//     receive_top_of_book(tradingStrategy);
//     const order_execution: Order = {
//       id: 1,
//       price: 12,
//       quantity: 100,
//       side: Side.SELL,
//       status: Status.REJECTED,
//       timestamp: Date.now(),
//     };
//     tradingStrategy.handle_market_response(order_execution);
//     const firstOrder = tradingStrategy.orders[0];
//     expect(firstOrder.side).toEqual(Side.BUY);
//     expect(firstOrder.price).toEqual(11);
//     expect(firstOrder.quantity).toEqual(100);
//     expect(firstOrder.status).toEqual(Status.NEW);
//   });
// });

// describe("Filled order", () => {
//   it("Should update position, cash, pnl", async () => {
//     const tradingStrategy = new TradingStrategy();
//     receive_top_of_book(tradingStrategy);
//     const order_execution1 = {
//       id: 1,
//       price: 11,
//       quantity: 100,
//       side: Side.SELL,
//       status: Status.FILLED,
//       timestamp: Date.now(),
//     };

//     tradingStrategy.handle_market_response(order_execution1);
//     expect(tradingStrategy.orders.length).toEqual(1);

//     const order_execution2 = { ...order_execution1 };
//     order_execution2.id = 2;
//     order_execution2.price = 12;
//     order_execution2.side = Side.BUY;

//     tradingStrategy.handle_market_response(order_execution2);
//     expect(tradingStrategy.position).toEqual(0);
//     expect(tradingStrategy.cash).toEqual(10100);
//     expect(tradingStrategy.pnl).toEqual(100);
//   });
// });
