import * as SA from 'superagent';
import Client from './Client';
export declare type SuperAgentRequestInterceptor = (req: SA.SuperAgentRequest) => SA.SuperAgentRequest;
export default class ExtendedClient extends Client {
    private _requestInterceptor?;
    private timezoneOffset?;
    constructor(baseUrl: string);
    private interceptRequest;
    requestInterceptor: SuperAgentRequestInterceptor | undefined;
    protected handleResponse<T>(response: SA.Response): T;
    protected ensureToken(): Promise<void>;
    protected processError(err: any): Error;
    private nullOn404;
}
