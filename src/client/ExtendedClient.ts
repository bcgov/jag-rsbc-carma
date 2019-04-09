import moment from 'moment';
import * as SA from 'superagent';
import saPrefix from 'superagent-prefix';
import superagentUse from 'superagent-use';
import Client from './Client';
import { NotificationEvent } from './models';
import { ApiError } from '../common/Errors';
import { TokenPayload } from '../common/authentication';
import { decodeJwt } from '../common/tokenUtils';

export type SuperAgentRequestInterceptor = (req: SA.SuperAgentRequest) => SA.SuperAgentRequest

export default class ExtendedClient extends Client {

    private _requestInterceptor?: SuperAgentRequestInterceptor;
    private timezoneOffset?: number;

    constructor(baseUrl: string) {
        super(
            superagentUse(SA.agent())
                .use(saPrefix(baseUrl))
        );
        (this.agent as any).use((req) => this.interceptRequest(req))
        this.errorProcessor = this.processError;
        this.timezoneOffset = -(new Date().getTimezoneOffset() / 60);
    }

    private interceptRequest(req: SA.SuperAgentRequest) {
        req.set('Accept', 'application/javascript');
        req.set('TZ-Offset', `${this.timezoneOffset}`);

        // SITEMINDER does not allow DELETE methods through, so here we use
        // a POST with the X-HTTP-METHOD-OVERRIDE
        if (req.method === 'DELETE') {
            req.method = 'POST';
            req.set('X-HTTP-METHOD-OVERRIDE', 'DELETE');
        }
        return this._requestInterceptor ? this._requestInterceptor(req) : req;
    }

    set requestInterceptor(interceptor: SuperAgentRequestInterceptor | undefined) {
        this._requestInterceptor = interceptor;
    }

    get requestInterceptor(): SuperAgentRequestInterceptor | undefined {
        return this._requestInterceptor;
    }

    protected handleResponse<T>(response: SA.Response) {
        return super.handleResponse<T>(response);
    }

    protected async ensureToken() {
        try {
            await super.ensureToken();
        } catch (err) {
            console.error(`Error fetching api token: '${err && err.message ? err.message : err}'`);
        }
    }

    protected processError(err): Error {
        let apiError = new ApiError(err);
        return apiError;
    }

    private async nullOn404<T>(method: () => Promise<T>): Promise<T> {
        try {
            return await method();
        } catch (err) {
            if (err.status === 404) {
                return undefined as any;
            } else {
                throw err;
            }
        }
    }
}