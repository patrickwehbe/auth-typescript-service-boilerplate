import { OptionsOfUnknownResponseBody } from "got";
import { ErrorResponse, Response } from "../models";

export interface IHttpClientService {
	/**
	 * Sends an HTTP request with the given options
	 * @param options Request options containing parameters such as the endpoint's url, request body, content-type...
	 */
	sendHttpRequest<T>(
		options: OptionsOfUnknownResponseBody,
		requestId?: string
	): Promise<Response<T> | ErrorResponse>;
}
