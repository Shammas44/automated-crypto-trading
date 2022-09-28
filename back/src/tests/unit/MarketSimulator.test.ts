import MarketSimulator from "../../trading/components/MarketSimulator";
import { Side, Action, Status, Order } from "../../types/order";

describe("Ensure that the trading rules are verified", () => {
  it("Should push order in orders list", async () => {
    const market_simulator = new MarketSimulator();
    const order: Order = {
      id: 10,
      price: 219,
      quantity: 10,
      side: Side.BID,
      action: Action.NEW,
      timestamp: Date.now(),
    };
    market_simulator.handle_order(order);
    expect(market_simulator.orders.length).toBe(1);
    expect(market_simulator.orders[0].status).toBe(Status.ACCEPTED);
  });

  it("Shouldn't push 'AMEND' order in order list", async () => {
    const market_simulator = new MarketSimulator();
    const order = {
      id: 10,
      price: 219,
      quantity: 10,
      side: Side.BID,
      action: Action.AMEND,
      timestamp: Date.now(),
    };
    market_simulator.handle_order(order);
    expect(market_simulator.orders.length).toBe(0);
  });
});
