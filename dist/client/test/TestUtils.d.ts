import ExtendedClient from '../ExtendedClient';
import { NotificationEvent } from '../models';
import '../../support/MomentMatchers';
import { TokenPayload } from '../../common/authentication';
export default class TestUtils {
    static DefaultAuthConfig: TokenPayload;
    static getClientWithAuth(authOverrides?: TokenPayload): ExtendedClient;
    static getClient(headers?: {
        [key: string]: string;
    }): ExtendedClient;
    /**
     * Authorizes a client instance and passes it to a callback that can be used
     * for creating / modifying test fixtures necessary for the following tests
     * @static
     * @param {(client:ExtendedClient)=>Promise<void>} setupFunc
     * @memberof TestUtils
     */
    static setupTestFixtures<T>(setupFunc: (client: ExtendedClient) => Promise<T>): Promise<T | undefined>;
    static randomString(length: number): string;
    static newTestNotification(notif?: Partial<NotificationEvent>): Promise<NotificationEvent>;
}
