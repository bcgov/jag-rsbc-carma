"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
var superAgent = __importStar(require("superagent"));
var authentication_1 = require("../common/authentication");
var TypedEvent_1 = require("../common/TypedEvent");
var cookieUtils_1 = require("../common/cookieUtils");
var Client = /** @class */ (function () {
    function Client(_agent) {
        if (_agent === void 0) { _agent = superAgent.agent(); }
        this._agent = _agent;
        this._previousToken = null;
        this._tokenChangedEvent = new TypedEvent_1.TypedEvent();
        /**
         * A hook to allow errors occured to be processed further before being thrown
         * out of the api client. This is useful for modifying validation errors etc.
         *
         * @memberof Client
         */
        this.errorProcessor = function (e) { return e; };
    }
    Object.defineProperty(Client.prototype, "onTokenChanged", {
        /**
         * An event that is fired when the app token associated with this client
         * has changed.
         *
         * @readonly
         * @type {TypedEvent<string|undefined>}
         * @memberof Client
         */
        get: function () {
            return this._tokenChangedEvent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Client.prototype, "agent", {
        /**
         * Returns the underlying SuperAgent instance being used for requests
         *
         * @readonly
         * @memberof Client
         */
        get: function () {
            return this._agent;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Hook responsible for extracting the value out of the response
     *
     * @protected
     * @template T
     * @param {superAgent.Response} response
     * @returns {T}
     * @memberof Client
     */
    Client.prototype.handleResponse = function (response) {
        return response.body;
    };
    /**
     * Ensures that a application token currently exists and fetches a new one
     * if the old one has expired or is not present.
     *
     * @protected
     * @returns {Promise<void>}
     * @memberof Client
     */
    Client.prototype.ensureToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = cookieUtils_1.retreiveCookieValue(authentication_1.TOKEN_COOKIE_NAME, this.agent);
                        if (!(token == undefined)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('Fetching new token');
                        return [4 /*yield*/, this.GetToken()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error("Couldn't fetch token", e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Takes a token and handles emitting events if the token has changed
     *
     * @protected
     * @param {string} [tokenString]
     * @memberof Client
     */
    Client.prototype.handleNewToken = function (token) {
        if (token !== this._previousToken) {
            this._previousToken = token;
            this.onTokenChanged.emit(token);
        }
    };
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
    Client.prototype.tryRequest = function (worker) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.ensureToken()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, worker()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, this.handleResponse(response)];
                    case 3:
                        error_1 = _a.sent();
                        if (this.errorProcessor) {
                            throw this.errorProcessor(error_1);
                        }
                        else {
                            throw error_1;
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.GetNotifications = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.tryRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.agent.get("/Notifications")];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response];
                            }
                        });
                    }); })];
            });
        });
    };
    Client.prototype.CreateNotification = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.tryRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.agent.post("/Notifications")
                                        .send(model)];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response];
                            }
                        });
                    }); })];
            });
        });
    };
    Client.prototype.GetNotificationById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.tryRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.agent.get("/Notifications/" + id)];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response];
                            }
                        });
                    }); })];
            });
        });
    };
    Client.prototype.UpdateNotification = function (id, model) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.tryRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.agent.put("/Notifications/" + id)
                                        .send(model)];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response];
                            }
                        });
                    }); })];
            });
        });
    };
    Client.prototype.DeleteNotification = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.tryRequest(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.agent.delete("/Notifications/" + id)];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response];
                            }
                        });
                    }); })];
            });
        });
    };
    return Client;
}());
exports.default = Client;
//# sourceMappingURL=C:/Dev/carma-api/dist/client/Client.js.map