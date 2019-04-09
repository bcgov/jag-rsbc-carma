/*
 ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______ 
|______||______||______||______||______||______||______||______||______||______||______|
  ___          _                  _____                                 _             _ 
 / _ \        | |                |  __ \                               | |           | |
/ /_\ \ _   _ | |_  ___          | |  \/  ___  _ __    ___  _ __  __ _ | |_  ___   __| |
|  _  || | | || __|/ _ \         | | __  / _ \| '_ \  / _ \| '__|/ _` || __|/ _ \ / _` |
| | | || |_| || |_| (_) |        | |_\ \|  __/| | | ||  __/| |  | (_| || |_|  __/| (_| |
\_| |_/ \__,_| \__|\___/          \____/ \___||_| |_| \___||_|   \__,_| \__|\___| \__,_|
______                 _   _         _             ___  ___            _  _   __        
|  _  \               | \ | |       | |            |  \/  |           | |(_) / _|       
| | | | ___           |  \| |  ___  | |_           | .  . |  ___    __| | _ | |_  _   _ 
| | | |/ _ \          | . ` | / _ \ | __|          | |\/| | / _ \  / _` || ||  _|| | | |
| |/ /| (_) |         | |\  || (_) || |_           | |  | || (_) || (_| || || |  | |_| |
|___/  \___/          \_| \_/ \___/  \__|          \_|  |_/ \___/  \__,_||_||_|   \__, |
                                                                                   __/ |
                                                                                  |___/ 
 ______  ______  ______  ______  ______  ______  ______  ______  ______  ______  ______ 
|______||______||______||______||______||______||______||______||______||______||______|

Client is generated from swagger.json file
*/
import * as superAgent from "superagent";
import { TOKEN_COOKIE_NAME } from '../common/authentication';
import { TypedEvent } from '../common/TypedEvent';
import { retreiveCookieValue } from '../common/cookieUtils';
import { 

    NotificationEventResponse,
    NotificationEvent 
} from "./models"


export default class Client {
    private _previousToken:string | undefined | null = null;
    private _tokenChangedEvent = new TypedEvent<string|undefined>();
    /**
     * An event that is fired when the app token associated with this client
     * has changed.
     *
     * @readonly
     * @type {TypedEvent<string|undefined>}
     * @memberof Client
     */
    public get onTokenChanged() : TypedEvent<string|undefined> {
        return this._tokenChangedEvent;
    }
    
    /**
     * A hook to allow errors occured to be processed further before being thrown
     * out of the api client. This is useful for modifying validation errors etc.
     *
     * @memberof Client
     */
    public errorProcessor: (error:any) => Error = (e)=>e;
    
    constructor(private _agent:superAgent.SuperAgent<any> = superAgent.agent()){
    }

    /**
     * Returns the underlying SuperAgent instance being used for requests
     *
     * @readonly
     * @memberof Client
     */
    get agent() {
        return this._agent;
    }

    /**
     * Hook responsible for extracting the value out of the response
     *
     * @protected
     * @template T
     * @param {superAgent.Response} response
     * @returns {T}
     * @memberof Client
     */
    protected handleResponse<T>(response:superAgent.Response):T {
        return response.body as T;
    }

    /**
     * Ensures that a application token currently exists and fetches a new one
     * if the old one has expired or is not present.
     *
     * @protected
     * @returns {Promise<void>}
     * @memberof Client
     */
    protected async ensureToken(): Promise<void> {
        let token = retreiveCookieValue(TOKEN_COOKIE_NAME, this.agent);
        // if there is no token, we will go out and retreive one
        if (token == undefined) {
            try{
                console.log('Fetching new token');
                await this.GetToken();
            }catch(e){                
                console.error("Couldn't fetch token",e);
            }
        }
    }

    /**
     * Takes a token and handles emitting events if the token has changed
     *
     * @protected
     * @param {string} [tokenString]
     * @memberof Client
     */
    protected handleNewToken(token?:string){
        if(token !== this._previousToken){
            this._previousToken = token;
            this.onTokenChanged.emit(token);
        }
    }

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
    protected async tryRequest<T>(worker: () => Promise<superAgent.Response>) : Promise<T> {
        try {
            await this.ensureToken();
            const response = await worker();
            return this.handleResponse(response);
        } catch (error) {
            if (this.errorProcessor) {
                throw this.errorProcessor(error);
            } else {
                throw error;
            }
        }
    }

    public async SendNotification( model:NotificationEvent ):Promise<NotificationEventResponse>{
        return this.tryRequest<NotificationEventResponse>(async () => {
            const response: superAgent.Response = await this.agent.post(`/Notifications`)
                .send(model)
            return response;
        });
    }    
    public async GetToken():Promise<any>{
        // For getting the token, we need to bypass the tryRequest as 
        // it will ensure token which will call this method again
        try{
            const response: superAgent.Response = await this.agent.get(`/token`)
            const { token:tokenString } = this.handleResponse<{ token: string }>(response);
            this.handleNewToken(tokenString);
            return tokenString;
        }catch(e){
            this.handleNewToken();
            throw e;
        }
    }    
    public async Logout():Promise<any>{
        await this.agent.post(`/token/delete`)
        this.handleNewToken();
    }    
}