// import EventBasedBackTester from "../../trading/components/EventBasedBackTester";
// import { load_financial_data } from "../../utility/utility";
// import { Strategies } from "../../types/order";

// describe("Test loop", () => {
//   it("", async () => {
//     const eb = new EventBasedBackTester(Strategies.Dual_MA);
//     const data = await load_financial_data(
//       new Date().toISOString(),
//       500,
//       "file.json"
//     );
//     expect(eb.ob).toEqual(expect.anything());
//     JSON.parse(data).forEach((element: any) => {
//       const price_information = {
//         date: element.Timestamp,
//         price: element.Close,
//       };
//       eb.process_data(price_information.price);
//       eb.process_events();
//     });
//     expect(data).toEqual(expect.anything());
//   });
// });
