import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '../common/authentication';
export declare const JWT_SECRET: string;
/**
 * Creates a compact JWT token string that from the given TokenPayload.
 * This token string can then be used in subsequent requests via headers
 * or cookies.
 *
 * @export
 * @param {TokenPayload} payload
 * @param {string} [secret=JWT_SECRET]
 * @param {jwt.SignOptions} [signOptions]
 * @returns {(Promise<string | undefined>)}
 */
export declare function createToken(payload: TokenPayload, secret?: string, signOptions?: jwt.SignOptions): Promise<string | undefined>;
/**
 * Verifies a compact JWT token string returning the TokenPayload if successful
 * Throw an exception if the token can't be verified.
 *
 * @export
 * @param {string} token
 * @param {string} [secret=JWT_SECRET]
 * @returns {Promise<TokenPayload>}
 */
export declare function verifyToken(token: string, secret?: string): Promise<TokenPayload>;
