import * as superAgent from "superagent";
import { TypedEvent } from '../common/TypedEvent';
import { NotificationEvent } from "./models";
export default class Client {
    private _agent;
    private _previousToken;
    private _tokenChangedEvent;
    /**
     * An event that is fired when the app token associated with this client
     * has changed.
     *
     * @readonly
     * @type {TypedEvent<string|undefined>}
     * @memberof Client
     */
    readonly onTokenChanged: TypedEvent<string | undefined>;
    /**
     * A hook to allow errors occured to be processed further before being thrown
     * out of the api client. This is useful for modifying validation errors etc.
     *
     * @memberof Client
     */
    errorProcessor: (error: any) => Error;
    constructor(_agent?: superAgent.SuperAgent<any>);
    /**
     * Returns the underlying SuperAgent instance being used for requests
     *
     * @readonly
     * @memberof Client
     */
    readonly agent: superAgent.SuperAgent<any>;
    /**
     * Hook responsible for extracting the value out of the response
     *
     * @protected
     * @template T
     * @param {superAgent.Response} response
     * @returns {T}
     * @memberof Client
     */
    protected handleResponse<T>(response: superAgent.Response): T;
    /**
     * Ensures that a application token currently exists and fetches a new one
     * if the old one has expired or is not present.
     *
     * @protected
     * @returns {Promise<void>}
     * @memberof Client
     */
    protected ensureToken(): Promise<void>;
    /**
     * Takes a token and handles emitting events if the token has changed
     *
     * @protected
     * @param {string} [tokenString]
     * @memberof Client
     */
    protected handleNewToken(token?: string): void;
    /**
     * All operations in the client are routed through this method which
     * is responsible for issuing and handling responses in a way which
     * errors can be captured and processed within the client.
     * This method also ensures that a client token exists before issuing the
     * request.
     *
     * @protected
     * @template T
     * @param {() => Promise<superAgent.Response>} worker
     * @returns {Promise<T>}
     * @memberof Client
     */
    protected tryRequest<T>(worker: () => Promise<superAgent.Response>): Promise<T>;
    GetNotifications(): Promise<Array<NotificationEvent>>;
    CreateNotification(model: NotificationEvent): Promise<NotificationEvent>;
    GetNotificationById(id: string): Promise<NotificationEvent>;
    UpdateNotification(id: string, model: NotificationEvent): Promise<NotificationEvent>;
    DeleteNotification(id: string): Promise<void>;
}
