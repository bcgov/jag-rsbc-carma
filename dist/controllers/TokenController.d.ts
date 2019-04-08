import { Controller } from 'tsoa';
import { TokenService } from '../services/TokenService';
import { Request as KoaRequest } from 'koa';
export declare class TokenController extends Controller {
    protected service: TokenService;
    getToken(request: KoaRequest): Promise<any>;
    logout(request: KoaRequest): Promise<any>;
}
