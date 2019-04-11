"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var CrudService_1 = require("./CrudService");
var typescript_ioc_1 = require("typescript-ioc");
var CurrentUser_1 = require("./CurrentUser");
var ServiceBase = /** @class */ (function (_super) {
    __extends(ServiceBase, _super);
    function ServiceBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServiceBase.prototype.currentUser = function () {
        return this._currentUser;
    };
    ServiceBase.prototype.getAll = function () {
        throw new Error('Method not implemented.');
    };
    ServiceBase.prototype.getById = function (id) {
        throw new Error('Method not implemented.');
    };
    ServiceBase.prototype.create = function (entity) {
        throw new Error('Method not implemented.');
    };
    ServiceBase.prototype.update = function (entity) {
        throw new Error('Method not implemented.');
    };
    ServiceBase.prototype.delete = function (id) {
        throw new Error('Method not implemented.');
    };
    ServiceBase.prototype.generateUuid = function () {
        return uuid_1.v4();
    };
    ServiceBase.prototype.filterNullValues = function (object) {
        var returnObj = {};
        Object.keys(object)
            .filter(function (k) { return object[k] !== null; })
            .forEach(function (k) {
            returnObj[k] = object[k];
        });
        return returnObj;
    };
    __decorate([
        typescript_ioc_1.Inject,
        __metadata("design:type", CurrentUser_1.CurrentUser)
    ], ServiceBase.prototype, "_currentUser", void 0);
    ServiceBase = __decorate([
        typescript_ioc_1.AutoWired
    ], ServiceBase);
    return ServiceBase;
}(CrudService_1.CrudService));
exports.ServiceBase = ServiceBase;
//# sourceMappingURL=../../src/dist/infrastructure/ServiceBase.js.map