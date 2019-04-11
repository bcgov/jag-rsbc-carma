"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../infrastructure/token");
var typescript_ioc_1 = require("typescript-ioc");
var TokenService = /** @class */ (function () {
    function TokenService() {
    }
    TokenService.prototype.generateToken = function (tokenPayload) {
        // Todo: Generate scopes based on database table
        return token_1.createToken(__assign({ scopes: ['default'] }, tokenPayload));
    };
    TokenService = __decorate([
        typescript_ioc_1.AutoWired
    ], TokenService);
    return TokenService;
}());
exports.TokenService = TokenService;
//# sourceMappingURL=../../src/dist/services/TokenService.js.map