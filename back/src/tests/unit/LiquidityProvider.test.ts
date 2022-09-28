import LiquidityProvider from "../../trading/components/LiquidityProvider";
import { Side, Action } from "../../types/order";
const liquidityProvider = new LiquidityProvider();

describe("Create an order", () => {
  it("Should create a valid order", async () => {
    liquidityProvider.generate_random_order();
    expect(liquidityProvider.orders[0]["id"]).toEqual(expect.anything());
    expect(liquidityProvider.orders[0]["side"]).toEqual(expect.anything());
    expect(liquidityProvider.orders[0]["quantity"]).toEqual(expect.anything());
    expect(liquidityProvider.orders[0]["price"]).toEqual(expect.anything());
    expect(liquidityProvider.orders[0]["action"]).toEqual(expect.anything());
  });
});
