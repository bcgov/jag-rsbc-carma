"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
var tsoa_1 = require("tsoa");
var typescript_ioc_1 = require("typescript-ioc");
var CurrentUser_1 = require("./infrastructure/CurrentUser");
var NotificationController_1 = require("./controllers/NotificationController");
var TokenController_1 = require("./controllers/TokenController");
var authentication_1 = require("./authentication");
var models = {
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
function RegisterRoutes(router) {
    var _this = this;
    router.post('/v1/Notifications', authenticateMiddleware([{ "name": "basic" }]), function (context, next) { return __awaiter(_this, void 0, void 0, function () {
        var args, validatedArgs, currentUserProvider, controller, promise;
        return __generator(this, function (_a) {
            args = {
                model: { "in": "body", "name": "model", "required": true, "ref": "NotificationEvent" },
            };
            validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            }
            catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return [2 /*return*/, next()];
            }
            currentUserProvider = {
                get: function () { return new CurrentUser_1.CurrentUser(context.request.user); }
            };
            typescript_ioc_1.Container.bind(CurrentUser_1.CurrentUser).provider(currentUserProvider);
            controller = typescript_ioc_1.Container.get(NotificationController_1.NotificationController);
            promise = controller.sendNotification.apply(controller, validatedArgs);
            return [2 /*return*/, promiseHandler(controller, promise, context, next)];
        });
    }); });
    router.get('/v1/token', authenticateMiddleware([{ "name": "siteminder" }]), function (context, next) { return __awaiter(_this, void 0, void 0, function () {
        var args, validatedArgs, currentUserProvider, controller, promise;
        return __generator(this, function (_a) {
            args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };
            validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            }
            catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return [2 /*return*/, next()];
            }
            currentUserProvider = {
                get: function () { return new CurrentUser_1.CurrentUser(context.request.user); }
            };
            typescript_ioc_1.Container.bind(CurrentUser_1.CurrentUser).provider(currentUserProvider);
            controller = typescript_ioc_1.Container.get(TokenController_1.TokenController);
            promise = controller.getToken.apply(controller, validatedArgs);
            return [2 /*return*/, promiseHandler(controller, promise, context, next)];
        });
    }); });
    router.post('/v1/token/delete', function (context, next) { return __awaiter(_this, void 0, void 0, function () {
        var args, validatedArgs, currentUserProvider, controller, promise;
        return __generator(this, function (_a) {
            args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };
            validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            }
            catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return [2 /*return*/, next()];
            }
            currentUserProvider = {
                get: function () { return new CurrentUser_1.CurrentUser(context.request.user); }
            };
            typescript_ioc_1.Container.bind(CurrentUser_1.CurrentUser).provider(currentUserProvider);
            controller = typescript_ioc_1.Container.get(TokenController_1.TokenController);
            promise = controller.logout.apply(controller, validatedArgs);
            return [2 /*return*/, promiseHandler(controller, promise, context, next)];
        });
    }); });
    function authenticateMiddleware(security) {
        var _this = this;
        if (security === void 0) { security = []; }
        return function (context, next) { return __awaiter(_this, void 0, void 0, function () {
            var e_1, _a, responded, success, security_1, security_1_1, secMethod, user, error_1, e_1_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        responded = 0;
                        success = false;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, 9, 10]);
                        security_1 = __values(security), security_1_1 = security_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!security_1_1.done) return [3 /*break*/, 7];
                        secMethod = security_1_1.value;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, authentication_1.koaAuthentication(context.request, secMethod.name, secMethod.scopes)
                            // only need to respond once
                        ];
                    case 4:
                        user = _b.sent();
                        // only need to respond once
                        if (!success) {
                            success = true;
                            responded++;
                            context.request['user'] = user;
                            return [2 /*return*/, next()];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        responded++;
                        // If no authentication was successful
                        if (responded == security.length && !success) {
                            context.throw(401, 'access_denied', "" + (error_1.message ? error_1.message : error_1));
                        }
                        return [3 /*break*/, 6];
                    case 6:
                        security_1_1 = security_1.next();
                        return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (security_1_1 && !security_1_1.done && (_a = security_1.return)) _a.call(security_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
    }
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, context, next) {
        return Promise.resolve(promise)
            .then(function (data) {
            if (data || data === false) {
                context.body = data;
                context.status = 200;
            }
            else {
                context.status = 204;
            }
            if (isController(controllerObj)) {
                var headers_1 = controllerObj.getHeaders();
                Object.keys(headers_1).forEach(function (name) {
                    context.set(name, headers_1[name]);
                });
                var statusCode = controllerObj.getStatus();
                if (statusCode) {
                    context.status = statusCode;
                }
            }
            return next();
        })
            .catch(function (error) {
            context.status = error.status || 500;
            context.body = error;
            return next();
        });
    }
    function getValidatedArgs(args, context) {
        var errorFields = {};
        var values = Object.keys(args).map(function (key) {
            var name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return context.request;
                case 'query':
                    return tsoa_1.ValidateParam(args[key], context.request.query[name], models, name, errorFields);
                case 'path':
                    return tsoa_1.ValidateParam(args[key], context.params[name], models, name, errorFields);
                case 'header':
                    return tsoa_1.ValidateParam(args[key], context.request.headers[name], models, name, errorFields);
                case 'body':
                    return tsoa_1.ValidateParam(args[key], context.request.body, models, name, errorFields, name + '.');
                case 'body-prop':
                    return tsoa_1.ValidateParam(args[key], context.request.body[name], models, name, errorFields, 'body.');
            }
        });
        if (Object.keys(errorFields).length > 0) {
            throw new tsoa_1.ValidateError(errorFields, '');
        }
        return values;
    }
}
exports.RegisterRoutes = RegisterRoutes;
//# sourceMappingURL=C:/Dev/jag-rsbc-carma/dist/routes.js.map