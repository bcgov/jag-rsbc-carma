"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var jwt = __importStar(require("jsonwebtoken"));
exports.JWT_SECRET = process.env.JWT_SECRET || "d3vS3cr37";
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
function createToken(payload, secret, signOptions) {
    if (secret === void 0) { secret = exports.JWT_SECRET; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (payload) {
                return [2 /*return*/, jwt.sign(__assign({ scopes: [] }, payload), secret, __assign({ algorithm: 'HS256', issuer: 'jag-shuber-api', audience: 'jag-shuber-client', expiresIn: '30m' }, signOptions))];
            }
            return [2 /*return*/];
        });
    });
}
exports.createToken = createToken;
/**
 * Verifies a compact JWT token string returning the TokenPayload if successful
 * Throw an exception if the token can't be verified.
 *
 * @export
 * @param {string} token
 * @param {string} [secret=JWT_SECRET]
 * @returns {Promise<TokenPayload>}
 */
function verifyToken(token, secret) {
    if (secret === void 0) { secret = exports.JWT_SECRET; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        if (!token) {
                            reject(new Error("No token provided"));
                        }
                        jwt.verify(token, secret, function (err, decoded) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(decoded);
                            }
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.verifyToken = verifyToken;
//# sourceMappingURL=C:/Dev/carma-api/dist/infrastructure/token.js.map