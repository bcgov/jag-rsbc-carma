import { toMatchShapeOf, toMatchOneOf } from 'jest-to-match-shape-of';
import ExtendedClient from '../ExtendedClient';
import { NotificationEvent } from '../models';
import { ClientBase } from 'pg';
import '../../support/MomentMatchers';
import {
    SITEMINDER_HEADER_USERGUID,
    SITEMINDER_HEADER_USERDISPLAYNAME,
    SITEMINDER_HEADER_USERIDENTIFIER,
    SITEMINDER_HEADER_USERTYPE,
    TokenPayload
} from '../../common/authentication';
import { NotificationService } from '../../services/NotificationService';

expect.extend({
    toMatchShapeOf,
    toMatchOneOf
});

export default class TestUtils {

    static DefaultAuthConfig: TokenPayload = {
        userId: 'bnye',
        displayName: 'Nye, Bill',
        guid: 'bnyeguid',
        type: 'testing'
    }

    static getClientWithAuth(authOverrides?: TokenPayload) {
        const authConfig = { ...TestUtils.DefaultAuthConfig, ...authOverrides };
        const { guid, displayName, userId, type } = authConfig;
        const headers = {};
        headers[SITEMINDER_HEADER_USERGUID] = guid;
        headers[SITEMINDER_HEADER_USERDISPLAYNAME] = displayName;
        headers[SITEMINDER_HEADER_USERIDENTIFIER] = userId;
        headers[SITEMINDER_HEADER_USERTYPE] = type;
        return this.getClient(headers);
    }

    static getClient(headers: { [key: string]: string } = {}): ExtendedClient {
        const client = new ExtendedClient('http://localhost:3001/api/v1');

        client.requestInterceptor = (req) => {
            Object.keys(headers).forEach(k => {
                req.set(k, headers[k]);
            });
            return req;
        }
        return client;
    }

    /**
     * Authorizes a client instance and passes it to a callback that can be used
     * for creating / modifying test fixtures necessary for the following tests
     * @static
     * @param {(client:ExtendedClient)=>Promise<void>} setupFunc
     * @memberof TestUtils
     */
    static async setupTestFixtures<T>(setupFunc: (client: ExtendedClient) => Promise<T>) {
        const authedApi = TestUtils.getClientWithAuth();
        if (setupFunc) {
            return await setupFunc(authedApi);
        }
    }

    static randomString(length: number) {
        let str = "";
        for (let i = 0; i < length; ++i) {
            str = `${str}${String.fromCharCode(65 + (Math.random() * 25))}`
        }
        return str;
    }

    static async newTestNotification(notif: Partial<NotificationEvent> = {}): Promise<NotificationEvent> {
        return await TestUtils.setupTestFixtures(api => api.CreateNotification({
            ...notif,
        })) as NotificationEvent;
    }
}

beforeAll(async (done) => {
    done();
});

afterAll(async (done) => {
    done();
});