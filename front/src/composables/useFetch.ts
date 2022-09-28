import axios from "axios";
import { UseFetchParameters } from "../types/utils";
/**
 * It takes a url, a method and a body and returns a response
 * @param {FetchParameters} params - FetchParameters
 * @returns The response from the fetch request.
 */
async function useFetch(params: UseFetchParameters) {
  const [url, method, data] = [params.url, params.method, params.data];

  const headers = {
    Accept: "application/json",
  };

  const requestOptions = {
    url: url,
    method: method,
    headers: headers,
    data: data,
  };

  const response = await axios(requestOptions).catch((error) => {
    if (error.response) {
      console.log("error: ", error.response);
      return error.response;
    }
  });
  return response.data;
}

export default useFetch;
