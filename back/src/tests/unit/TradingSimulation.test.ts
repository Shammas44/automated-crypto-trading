import TradingSimulation from "../../trading/components/TradingSimulation";
import { Order, Side, Action } from "../../types/order";

describe("Test add liquidity", () => {
  it("", async () => {
    const ts = new TradingSimulation();
    // Order sent from the exchange to the trading system
    const order1: Order = {
      id: 1,
      price: 219,
      quantity: 10,
      side: Side.BID,
      action: Action.NEW,
      timestamp: Date.now(),
    };

    const order2: Order = {
      id: 2,
      price: 218,
      quantity: 10,
      side: Side.ASK,
      action: Action.NEW,
      timestamp: Date.now(),
    };

    ts.lp.insert_manual_order(order1);
    expect(ts.lp_2_gateway.length).toEqual(1);
    ts.ob.handle_order_from_gateway();
    expect(ts.ob_2_ts.length).toEqual(1);
    ts.ts.handle_input_from_ob();
    expect(ts.ts_2_om.length).toEqual(0);

    ts.lp.insert_manual_order({ ...order2 });
    expect(ts.lp_2_gateway.length).toEqual(1);
    ts.ob.handle_order_from_gateway();
    expect(ts.ob_2_ts.length).toEqual(1);
    ts.ts.handle_input_from_ob();
    expect(ts.ts_2_om.length).toEqual(2);
    ts.om.handle_input_from_ts();
    expect(ts.ts_2_om.length).toEqual(1);
    expect(ts.om_2_gw.length).toEqual(1);
    ts.om.handle_input_from_ts();
    expect(ts.ts_2_om.length).toEqual(0);
    expect(ts.om_2_gw.length).toEqual(2);
    ts.ms.handle_order_from_gw();
    expect(ts.gw_2_om.length).toEqual(1);
    ts.ms.handle_order_from_gw();
    expect(ts.gw_2_om.length).toEqual(2);
    ts.om.handle_input_from_market();
    ts.om.handle_input_from_market();
    expect(ts.om_2_ts.length).toEqual(2);
    ts.ts.handle_response_from_om();
    expect(ts.ts.get_pnl()).toEqual(0);
    ts.ms.fill_all_orders();
    expect(ts.gw_2_om.length).toEqual(2);
    ts.om.handle_input_from_market();
    ts.om.handle_input_from_market();
    expect(ts.om_2_ts.length).toEqual(3);
    ts.ts.handle_response_from_om();
    expect(ts.om_2_ts.length).toEqual(2);
    ts.ts.handle_response_from_om();
    expect(ts.om_2_ts.length).toEqual(1);
    ts.ts.handle_response_from_om();
    expect(ts.om_2_ts.length).toEqual(0);
    expect(ts.ts.get_pnl()).toEqual(10);
  });
});
