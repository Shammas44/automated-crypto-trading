import Denque from "denque";
import LiquidityProvider from "./LiquidityProvider";
import OrderBook from "./OrderBook";
import OrderManager from "./OrderManager";
import MarketSimulator from "./MarketSimulator";
import {
  Order,
  Side,
  Action,
  Strategies,
  TradingParameters,
} from "../../types/order";
import { DynamicClass } from "../../utility/DynamicClass";
import TradingStrategyDualMa from "./strategies/TradingStrategyDualMa";
// import { AvailableStrategies } from "../../stores/mainStore";
import TradingStrategy from "./TradingStrategy";

type CurrentStrategy<T extends TradingStrategy> = T;

class EventBasedBackTester {
  lp_2_gateway: Denque;
  ob_2_ts: Denque;
  ts_2_om: Denque;
  ms_2_om: Denque;
  om_2_ts: Denque;
  gw_2_om: Denque;
  om_2_gw: Denque;
  lp: LiquidityProvider;
  ob: OrderBook;
  ts: CurrentStrategy<TradingStrategyDualMa>;
  ms: MarketSimulator;
  om: OrderManager;

  constructor(strategy: Strategies) {
    this.lp_2_gateway = new Denque();
    this.ob_2_ts = new Denque();
    this.ts_2_om = new Denque();
    this.ms_2_om = new Denque();
    this.om_2_ts = new Denque();
    this.gw_2_om = new Denque();
    this.om_2_gw = new Denque();
    this.lp = new LiquidityProvider(this.lp_2_gateway);
    this.ob = new OrderBook(this.lp_2_gateway, this.ob_2_ts);
    this.ts = new DynamicClass(strategy, {
      ob_2_ts: this.ob_2_ts,
      ts_2_om: this.ts_2_om,
      om_2_ts: this.om_2_ts,
    } as TradingParameters) as TradingStrategyDualMa;
    this.ms = new MarketSimulator(this.om_2_gw, this.gw_2_om);
    this.om = new OrderManager(
      this.ts_2_om,
      this.om_2_ts,
      this.om_2_gw,
      this.gw_2_om
    );
  }

  process_data(price: number) {
    const order_bid: Order = {
      id: 1,
      price: price,
      quantity: 1000,
      side: Side.BID,
      action: Action.NEW,
      timestamp: Date.now(),
    };
    const order_ask: Order = {
      id: 1,
      price: price,
      quantity: 1000,
      side: Side.ASK,
      action: Action.NEW,
      timestamp: Date.now(),
    };
    this.lp_2_gateway.push(order_ask);
    this.lp_2_gateway.push(order_bid);
    this.process_events();
    order_ask.action = Action.DELETE;
    order_bid.action = Action.DELETE;
    this.lp_2_gateway.push(order_ask);
    this.lp_2_gateway.push(order_bid);
  }

  process_events() {
    while (this.lp_2_gateway.length > 0) {
      while (this.lp_2_gateway.length > 0) this.ob.handle_order_from_gateway();
      while (this.ob_2_ts.length > 0) this.ts.handle_input_from_ob();
      while (this.ts_2_om.length > 0) this.om.handle_order_from_ts();
      while (this.om_2_gw.length > 0) this.ms.handle_order_from_gw();
      while (this.gw_2_om.length > 0) this.om.handle_input_from_market();
      while (this.om_2_ts.length > 0) this.ts.handle_response_from_om();
    }
  }
}

export default EventBasedBackTester;
