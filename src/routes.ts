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

Routes are generated from models and controllers
*/

/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { Container, Provider } from 'typescript-ioc';
import { CurrentUser } from './infrastructure/CurrentUser';
import Router from 'koa-router';
import { Context } from 'koa';
import { NotificationController } from './controllers/NotificationController';
import { TokenController } from './controllers/TokenController';
import { koaAuthentication } from './authentication';

const models: TsoaRoute.Models = {
    "NotificationEventResponse": {
        "properties": {
            "respCd": { "dataType": "double", "required": true },
            "respMsg": { "dataType": "string", "required": true },
        },
    },
    "NotificationEvent": {
        "properties": {
            "correlationId": { "dataType": "string", "required": true },
            "noticeNumber": { "dataType": "string", "required": true },
            "noticeTypeCd": { "dataType": "string", "required": true },
            "eventTypeCd": { "dataType": "string", "required": true },
            "eventDt": { "dataType": "string", "required": true },
        },
    },
};

export function RegisterRoutes(router: Router) {
    router.post('/v1/Notifications',
        authenticateMiddleware([{ "basic": [] }]),
        async (context: Context, next: () => Promise<any>) => {
            const args = {
                model: { "in": "body", "name": "model", "required": true, "ref": "NotificationEvent" },
            };

            let validatedArgs: any;
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            // Create the currentUser from the context and bind it to the ioc container
            const currentUserProvider: Provider = {
                get: () => new CurrentUser(context.request.user)
            }
            Container.bind(CurrentUser).provider(currentUserProvider);
            // Using the typescript-ioc container, retrieve controller
            const controller = Container.get(NotificationController) as NotificationController;

            const promise = controller.sendNotification.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });
    router.get('/v1/token',
        authenticateMiddleware([{ "siteminder": [] }]),
        async (context: Context, next: () => Promise<any>) => {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any;
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            // Create the currentUser from the context and bind it to the ioc container
            const currentUserProvider: Provider = {
                get: () => new CurrentUser(context.request.user)
            }
            Container.bind(CurrentUser).provider(currentUserProvider);
            // Using the typescript-ioc container, retrieve controller
            const controller = Container.get(TokenController) as TokenController;

            const promise = controller.getToken.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });
    router.post('/v1/token/delete',
        async (context: Context, next: () => Promise<any>) => {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any;
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            // Create the currentUser from the context and bind it to the ioc container
            const currentUserProvider: Provider = {
                get: () => new CurrentUser(context.request.user)
            }
            Container.bind(CurrentUser).provider(currentUserProvider);
            // Using the typescript-ioc container, retrieve controller
            const controller = Container.get(TokenController) as TokenController;

            const promise = controller.logout.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async (context: Context, next: () => Promise<any>) => {
            let responded = 0;
            let success = false;
            for (const secMethod of security) {
                try {
                    const name = Object.keys(secMethod).shift()!;
                    const user = await koaAuthentication(context.request, name, secMethod[name])
                    // only need to respond once
                    if (!success) {
                        success = true;
                        responded++;
                        context.request['user'] = user;
                        return next();
                    }
                } catch (error) {
                    responded++;
                    // If no authentication was successful
                    if (responded == security.length && !success) {
                        context.throw(401, 'access_denied', `${error.message ? error.message : error}`);
                    }
                }
            }
        }
    }

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: Promise<any>, context: any, next: () => Promise<any>) {
        return Promise.resolve(promise)
            .then((data: any) => {
                if (data || data === false) {
                    context.body = data;
                    context.status = 200;
                } else {
                    context.status = 204;
                }

                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        context.set(name, headers[name]);
                    });

                    const statusCode = controllerObj.getStatus();
                    if (statusCode) {
                        context.status = statusCode;
                    }
                }
                return next();
            })
            .catch((error: any) => {
                context.status = error.status || 500;
                context.body = error;
                return next();
            });
    }

    function getValidatedArgs(args: any, context: any): any[] {
        const errorFields: FieldErrors = {};
        const values = Object.keys(args).map(key => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return context.request;
                case 'query':
                    return ValidateParam(args[key], context.request.query[name], models, name, errorFields)
                case 'path':
                    return ValidateParam(args[key], context.params[name], models, name, errorFields)
                case 'header':
                    return ValidateParam(args[key], context.request.headers[name], models, name, errorFields);
                case 'body':
                    return ValidateParam(args[key], context.request.body, models, name, errorFields, name + '.');
                case 'body-prop':
                    return ValidateParam(args[key], context.request.body[name], models, name, errorFields, 'body.');
            }
        });
        if (Object.keys(errorFields).length > 0) {
            throw new ValidateError(errorFields, '');
        }
        return values;
    }
}