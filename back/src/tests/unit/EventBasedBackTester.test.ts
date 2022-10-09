import EventBasedBackTester from "../../trading/components/EventBasedBackTester";
import { Strategies } from "../../types/order";
import { load_financial_data } from "../../utility/utility";
import {
  CryptoBar,
  CryptoQuote,
  CryptoTrade,
} from "@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2";

jest.setTimeout(10000);

describe("Test loop", () => {
  it("orders should be properly processed", (done) => {
    // expect(1).toEqual(1);
    const eb = new EventBasedBackTester(Strategies.Dual_MA);
    load_financial_data(new Date().toISOString(), 500, "file.json").then(
      (data) => {
        expect(data).toEqual(expect.anything());
        let parsedData = JSON.parse(data);
        parsedData = parsedData.slice(0, 10);
        parsedData.forEach((bar: CryptoBar) => {
          const price_information = {
            date: bar.Timestamp,
            price: bar.Close,
          };
          eb.process_data(price_information.price);
          eb.process_events();
        });
        expect(eb.ob).toEqual(expect.anything());
        done();
      }
    );
  });
});
