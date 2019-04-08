import { TokenPayload } from '../common/authentication';
/**
 * The CurrentUser object is used here to allow us to inject the
 * current user token into classes using dependency injection
 * since classes are actual types versus an interface or generics
 * that are for typing information only.
 *
 * @export
 * @class CurrentUser
 */
export declare class CurrentUser {
    private _token;
    readonly token: TokenPayload;
    readonly displayName: string;
    constructor(_token?: TokenPayload);
}
