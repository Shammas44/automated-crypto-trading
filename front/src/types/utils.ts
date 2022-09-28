export interface UseFetchParameters {
  url: string;
  method: string;
  data?: any;
}

export enum HttpRequest {
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}
