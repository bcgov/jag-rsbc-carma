"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The CurrentUser object is used here to allow us to inject the
 * current user token into classes using dependency injection
 * since classes are actual types versus an interface or generics
 * that are for typing information only.
 *
 * @export
 * @class CurrentUser
 */
var CurrentUser = /** @class */ (function () {
    function CurrentUser(_token) {
        if (_token === void 0) { _token = {}; }
        this._token = _token;
    }
    Object.defineProperty(CurrentUser.prototype, "token", {
        get: function () {
            return this._token;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CurrentUser.prototype, "displayName", {
        get: function () {
            var _a = this.token.displayName, displayName = _a === void 0 ? 'UNKNOWN_USER' : _a;
            return displayName;
        },
        enumerable: true,
        configurable: true
    });
    return CurrentUser;
}());
exports.CurrentUser = CurrentUser;
//# sourceMappingURL=../../src/dist/infrastructure/CurrentUser.js.map