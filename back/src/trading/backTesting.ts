export enum AssetsKind {
  TRADE,
  QUOTE,
  BAR,
}
export interface DataStreamParameters {
  keyId: string;
  secretKey: string;
  paper: boolean;
  exchanges: string;
  symbol: string;
  emitData: (dataKey: string, data: any) => void;
}
