import { Request } from 'koa';
import { Scope } from './common/authentication';
/**
 * The type of security that should be applied to the endpoint.
 * siteminder -> extracts user information from siteminder headers
 * jwt -> extracs user information / scopes from JSON Web Token
 */
export declare type SecurityType = "siteminder" | "jwt" | "basic";
/**
 * Wrapper around TSOA Security decorator to give us type safety
 *
 * @export
 * @param {SecurityType} securityType
 * @param {Scope[]} [scopes=DEFAULT_SCOPES]
 * @returns
 */
export declare function Security(securityType: SecurityType, scopes?: Scope[]): Function;
/**
 * Sets the Token Cookie
 *
 * @export
 * @param {Request} request
 * @param {string} token
 */
export declare function setTokenCookie(request: Request, token: string): void;
/**
 * Gets the Token string from the Cookie
 *
 * @export
 * @param {Request} request
 * @returns {string}
 */
export declare function getTokenCookie(request: Request): string;
export declare function deleteTokenCookie(request: Request): void;
/**
 * The authentication middleware used by TSOA
 * see https://github.com/lukeautry/tsoa#authentication
 *
 * @export
 * @param {Request} request
 * @param {string} securityName
 * @param {string[]} [securityScopes=DEFAULT_SCOPES]
 * @returns {Promise<any>}
 */
export declare function koaAuthentication(request: Request, securityName: string, securityScopes?: string[]): Promise<any>;
