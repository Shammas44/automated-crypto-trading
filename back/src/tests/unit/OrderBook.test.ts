import OrderBook from "../../trading/components/OrderBook";
import { Side, Action, Order, BookEvent } from "../../types/order";

const order1 = {
  id: 1,
  price: 219,
  quantity: 10,
  side: Side.BID,
  action: Action.NEW,
} as Order;

function handle_new(orderBook: OrderBook) {
  const ob_for_aapl = orderBook;
  ob_for_aapl.handle_order(order1);
  const order2 = { ...order1 };
  order2.id = 2;
  order2.price = 220;
  ob_for_aapl.handle_order(order2);
  const order3 = { ...order1 };
  order3.id = 3;
  order3.price = 223;
  ob_for_aapl.handle_order(order3);
  const order4 = { ...order1 };
  order4.side = Side.ASK;
  order4.id = 4;
  order4.price = 220;
  ob_for_aapl.handle_order(order4);
  const order5 = { ...order4 };
  order5.id = 5;
  order5.price = 223;
  ob_for_aapl.handle_order(order5);
  const order6 = { ...order4 };
  order6.id = 6;
  order6.price = 221;
  ob_for_aapl.handle_order(order6);

  expect(ob_for_aapl.list_bids[0].id).toEqual(3);
  expect(ob_for_aapl.list_bids[1].id).toEqual(2);
  expect(ob_for_aapl.list_bids[2].id).toEqual(1);
  expect(ob_for_aapl.list_asks[0].id).toEqual(4);
  expect(ob_for_aapl.list_asks[1].id).toEqual(6);
  expect(ob_for_aapl.list_asks[2].id).toEqual(5);
}

describe("Test methodes behaviors", () => {
  it("Handle_new", async () => {
    const orderBook = new OrderBook();
    handle_new(orderBook);
  });

  it("Generate_book_event", async () => {
    const orderBook = new OrderBook();
    const book_event1 = {
      bid_price: 219,
      bid_quantity: 10,
      ask_price: -1,
      ask_quantity: -1,
    } as BookEvent;
    expect(orderBook.handle_order(order1)).toEqual(book_event1);

    const order2 = { ...order1 };
    order2.id = 2;
    order2.price = 220;
    order2.side = Side.ASK;
    const book_event2 = {
      bid_price: 219,
      bid_quantity: 10,
      ask_price: 220,
      ask_quantity: 10,
    } as BookEvent;

    expect(orderBook.handle_order(order2)).toEqual(book_event2);
  });

  it("Handle_amend", async () => {
    const orderBook = new OrderBook();
    handle_new(orderBook);
    const modificationOrder = { ...order1 };
    // for an unknown reason, the following line modify the order1 object
    modificationOrder.quantity = 5;
    modificationOrder.action = Action.MODIFY;
    orderBook.handle_order(modificationOrder);
    expect(orderBook.list_bids[2].id).toEqual(1);
    expect(orderBook.list_bids[2].quantity).toEqual(5);
  });

  it("Handle_deletion", async () => {
    const orderBook = new OrderBook();
    handle_new(orderBook);
    const modificationOrder = { ...order1 };
    modificationOrder.action = Action.DELETE;

    expect(orderBook.list_bids.length).toEqual(3);
    orderBook.handle_order(modificationOrder);
    expect(orderBook.list_bids.length).toEqual(2);
  });
});
