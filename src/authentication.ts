import { Request } from 'koa';
import moment from 'moment';
import { Security as TSOASecurity } from 'tsoa';
import {
    Scope,
    assertAllScopes,
    AUTH_ERROR,
    SITEMINDER_HEADER_USERGUID,
    SITEMINDER_HEADER_USERDISPLAYNAME,
    SITEMINDER_HEADER_USERIDENTIFIER,
    SITEMINDER_HEADER_USERTYPE,
    TokenPayload,
    DEFAULT_SCOPES,
    TOKEN_COOKIE_NAME,
    BasicAuthPayload
} from './common/authentication';
import { verifyToken } from './infrastructure/token';
import { stringify } from 'jest-matcher-utils';

/**
 * The type of security that should be applied to the endpoint.
 * siteminder -> extracts user information from siteminder headers
 * jwt -> extracs user information / scopes from JSON Web Token
 */
export type SecurityType = "siteminder" | "jwt" | "basic";

/**
 * Wrapper around TSOA Security decorator to give us type safety
 *
 * @export
 * @param {SecurityType} securityType
 * @param {Scope[]} [scopes=DEFAULT_SCOPES]
 * @returns
 */
export function Security(securityType: SecurityType, scopes: Scope[] = DEFAULT_SCOPES) {
    return TSOASecurity(securityType, scopes);
}

/**
 * Sets the Token Cookie
 *
 * @export
 * @param {Request} request
 * @param {string} token
 */
export function setTokenCookie(request: Request, token: string) {
    request.ctx.cookies.set(TOKEN_COOKIE_NAME, token, {
        // signed: true,
        // secure: true,
        overwrite: true,
        httpOnly: false,
        maxAge: 30 * 60 * 1000
    });
}

/**
 * Gets the Token string from the Cookie
 *
 * @export
 * @param {Request} request
 * @returns {string}
 */
export function getTokenCookie(request: Request): string {
    return request.ctx.cookies.get(TOKEN_COOKIE_NAME)
}

export function deleteTokenCookie(request: Request) {    
    request.ctx.cookies.set(TOKEN_COOKIE_NAME, getTokenCookie(request), {
        overwrite: true,
        httpOnly: false,
        expires: moment().subtract(1, 'hour').toDate()
    })
}

/**
 * Parses a TokenPayload from siteminder headers if they are present
 * @param {Request} request
 * @returns {TokenPayload}
 */
function getTokenPayloadFromHeaders(request: Request): TokenPayload {
    const { headers = {} } = request;
    return {
        guid: headers[SITEMINDER_HEADER_USERGUID],
        displayName: headers[SITEMINDER_HEADER_USERDISPLAYNAME],
        userId: headers[SITEMINDER_HEADER_USERIDENTIFIER],
        type: headers[SITEMINDER_HEADER_USERTYPE]
    }
}

/**
 * Parses a basic auth token from request headers if they are present
 * @param {Request} request
 * @returns {TokenPayload}
 */
function getBasicAuthPayloadFromHeaders(request: Request): BasicAuthPayload {
    const response: BasicAuthPayload = { username: "", password: ""};
    const { headers = {} } = request;
    if (headers.authorization)
    {
        const base64Credentials =  headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        response.password = password;
        response.username = username;
    }
    return response;
}

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
export async function koaAuthentication(request: Request, securityName: string, securityScopes: string[] = DEFAULT_SCOPES): Promise<any> {
    const securityType: SecurityType = securityName as any;
    const scopes: Scope[] = securityScopes as any;

    switch (securityType) {
        case 'siteminder':
            const siteminderHeaders = getTokenPayloadFromHeaders(request);
            if (siteminderHeaders && siteminderHeaders.guid) {
                return siteminderHeaders;
            } else {
                throw AUTH_ERROR
            }
        case 'jwt':
            const token = request.ctx.cookies.get(TOKEN_COOKIE_NAME);
            const payload = await verifyToken(token);
            assertAllScopes(payload, scopes);
            return payload;
        case 'basic':
            const basicAuthHeaders = getBasicAuthPayloadFromHeaders(request);
            if (basicAuthHeaders && basicAuthHeaders.password == process.env.API_PASSWORD && basicAuthHeaders.username == process.env.API_USERNAME)
            {
                return basicAuthHeaders;
            } else {
                throw AUTH_ERROR
            }
        break;
    }

    throw new Error('Unknown Security Type');
}
