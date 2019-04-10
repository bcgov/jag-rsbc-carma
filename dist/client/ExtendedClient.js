"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SA = __importStar(require("superagent"));
var superagent_prefix_1 = __importDefault(require("superagent-prefix"));
var superagent_use_1 = __importDefault(require("superagent-use"));
var Client_1 = __importDefault(require("./Client"));
var Errors_1 = require("../common/Errors");
var ExtendedClient = /** @class */ (function (_super) {
    __extends(ExtendedClient, _super);
    function ExtendedClient(baseUrl) {
        var _this = _super.call(this, superagent_use_1.default(SA.agent())
            .use(superagent_prefix_1.default(baseUrl))) || this;
        _this.agent.use(function (req) { return _this.interceptRequest(req); });
        _this.errorProcessor = _this.processError;
        _this.timezoneOffset = -(new Date().getTimezoneOffset() / 60);
        return _this;
    }
    ExtendedClient.prototype.interceptRequest = function (req) {
        req.set('Accept', 'application/javascript');
        req.set('TZ-Offset', "" + this.timezoneOffset);
        // SITEMINDER does not allow DELETE methods through, so here we use
        // a POST with the X-HTTP-METHOD-OVERRIDE
        if (req.method === 'DELETE') {
            req.method = 'POST';
            req.set('X-HTTP-METHOD-OVERRIDE', 'DELETE');
        }
        return this._requestInterceptor ? this._requestInterceptor(req) : req;
    };
    Object.defineProperty(ExtendedClient.prototype, "requestInterceptor", {
        get: function () {
            return this._requestInterceptor;
        },
        set: function (interceptor) {
            this._requestInterceptor = interceptor;
        },
        enumerable: true,
        configurable: true
    });
    ExtendedClient.prototype.handleResponse = function (response) {
        return _super.prototype.handleResponse.call(this, response);
    };
    ExtendedClient.prototype.ensureToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, _super.prototype.ensureToken.call(this)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error("Error fetching api token: '" + (err_1 && err_1.message ? err_1.message : err_1) + "'");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ExtendedClient.prototype.processError = function (err) {
        var apiError = new Errors_1.ApiError(err);
        return apiError;
    };
    ExtendedClient.prototype.nullOn404 = function (method) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, method()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        if (err_2.status === 404) {
                            return [2 /*return*/, undefined];
                        }
                        else {
                            throw err_2;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ExtendedClient;
}(Client_1.default));
exports.default = ExtendedClient;
//# sourceMappingURL=C:/Dev/jag-rsbc-carma/dist/client/ExtendedClient.js.map