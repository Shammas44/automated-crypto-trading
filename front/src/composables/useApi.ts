import { HttpRequest } from "../types/utils";
const port = 8000;
const serverUrl = `http://localhost:${port}/`;
const useApi = {
  quotation: {
    url: () => `${serverUrl}quotation`,
    method: HttpRequest.GET,
  },
  backtesting: {
    url: () => `${serverUrl}backtesting`,
    method: HttpRequest.GET,
  },
};

export default useApi;
