import Denque from "denque";
export interface StdObject {
  [key: string]: any;
}

export interface Order {
  id: number;
  price: number;
  quantity: number;
  side?: Side;
  action?: Action;
  status?: Status;
  timestamp: number;
}

export interface OrderWrapper {
  order: Order;
  position: number;
}
export interface BookEvent {
  bid_price: number;
  bid_quantity: number;
  ask_price: number;
  ask_quantity: number;
}

export enum Action {
  NEW = "new",
  UPDATE = "update",
  DELETE = "delete",
  NONE = "no action",
  SEND = "to be sent",
  CANCEL = "cancel",
  AMEND = "amend",
  MODIFY = "modify",
}

export enum Side {
  BUY = "buy",
  SELL = "sell",
  BID = "bid",
  ASK = "ask",
}
export enum Status {
  NEW = "new",
  REJECTED = "rejected",
  FILLED = "filled",
  ACKED = "acked",
  ACCEPTED = "accepted",
  CANCELLED = "cancelled",
}

export enum Strategies {
  Dual_MA = "TradingStrategyDualMa",
}

export interface TradingStrategyFeatures {
  handle_input_from_ob: (book_event: BookEvent | null) => void;
  buy_sell_or_hold_something: (book_event: BookEvent) => void;
  handle_book_event: (book_event: BookEvent | null) => void;
  signal: (book_event: BookEvent | null) => boolean;
  execution: () => void;
  handle_market_response: (order_execution: any) => void;
  get_pnl: () => number;
  search_order: (id: number) => OrderWrapper | null;
  handle_response_from_om: () => void;
  create_orders: (book_event: BookEvent, quantity: number) => void;
  create_metrics_out_of_prices: (price_update: any) => void;
}

export interface TradingParameters {
  ob_2_ts: Denque | null;
  ts_2_om: Denque | null;
  om_2_ts: Denque | null;
}

export interface EmitData {
  (name: string, data: any): void;
}
