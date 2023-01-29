import * as GOT from "got";
import { OptionsOfUnknownResponseBody } from "got";
import { LogicalError } from "../../errors";
import { IHttpClientService, ILogger } from "../../interfaces";
import { ErrorResponse, Response } from "../../models";
import Wrapper from "../wrapper.abstract";

export class HttpClientService extends Wrapper<GOT.Got> implements IHttpClientService {
	private static DEFAULT_INSTANCE = GOT.default.extend({
		retry: {
			limit: 3,
			statusCodes: [500, 502, 504],
			methods: ["DELETE", "GET", "POST", "PUT", "HEAD", "OPTIONS"],
		},
		throwHttpErrors: false,
		responseType: "json",
	});
	protected instance: GOT.Got;

	constructor(logger?: ILogger) {
		super(logger);
		this.instance = HttpClientService.DEFAULT_INSTANCE;
	}

	async sendHttpRequest<T>(
		options: OptionsOfUnknownResponseBody,
		requestId?: string
	): Promise<Response<T> | ErrorResponse> {
		try {
			this.logger.info(
				`Sending HTTP request to '${options.url}' with method '${
					options.method || "GET"
				}'`
			);
			const response = await this.instance({
				...options,
				headers: { ...options.headers, requestId: `${requestId}` },
			});

			if (response.statusCode >= 200 && response.statusCode <= 299) {
				this.logger.info(
					`Sending HTTP request to '${options.url}' with method '${options.method}' returned status ${response.statusCode}`
				);
			} else {
				this.logger.error(
					`Sending HTTP request to '${options.url}' with method '${options.method}' returned exception. Error status code: ${response.statusCode}`
				);
			}
			return response.body as Response<T> | ErrorResponse;
		} catch (error: any) {
			this.logger.error(
				`Something went wrong. Error details: ${JSON.stringify(error.message)}`
			);
			throw new LogicalError(error.message);
		}
	}
}
