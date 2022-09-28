import LiquidityProvider from "./LiquidityProvider";
import TradingStrategy from "./TradingStrategy";
import MarketSimulator from "./MarketSimulator";
import OrderManager from "./OrderManager";
import OrderBook from "./OrderBook";
import Denque from "denque";
class TradingSimulation {
  lp_2_gateway: Denque;
  ob_2_ts: Denque;
  ts_2_om: Denque;
  ms_2_om: Denque;
  om_2_ts: Denque;
  gw_2_om: Denque;
  om_2_gw: Denque;

  lp: LiquidityProvider;
  ob: OrderBook;
  ts: TradingStrategy;
  ms: MarketSimulator;
  om: OrderManager;

  constructor() {
    this.lp_2_gateway = new Denque();
    this.ob_2_ts = new Denque();
    this.ts_2_om = new Denque();
    this.ms_2_om = new Denque();
    this.om_2_ts = new Denque();
    this.gw_2_om = new Denque();
    this.om_2_gw = new Denque();

    this.lp = new LiquidityProvider(this.lp_2_gateway);
    this.ob = new OrderBook(this.lp_2_gateway, this.ob_2_ts);
    this.ts = new TradingStrategy({
      ob_2_ts: this.ob_2_ts,
      ts_2_om: this.ts_2_om,
      om_2_ts: this.om_2_ts,
    });
    this.ms = new MarketSimulator(this.om_2_gw, this.gw_2_om);
    this.om = new OrderManager(
      this.ts_2_om,
      this.om_2_ts,
      this.om_2_gw,
      this.gw_2_om
    );
  }

  start() {
    this.lp.read_tick_data_from_data_source();

    while (this.lp_2_gateway.length > 0) {
      this.ob.handle_order_from_gateway();
      this.ts.handle_input_from_ob();
      this.om.handle_input_from_ts();
      this.ms.handle_order_from_gw();
      this.om.handle_input_from_market();
      this.ts.handle_response_from_om();
      this.lp.read_tick_data_from_data_source();
    }
  }
}
export default TradingSimulation;
