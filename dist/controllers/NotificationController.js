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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tsoa_1 = require("tsoa");
var NotificationService_1 = require("../services/NotificationService");
var ControllerBase_1 = __importDefault(require("../infrastructure/ControllerBase"));
var authentication_1 = require("../authentication");
var typescript_ioc_1 = require("typescript-ioc");
var NotificationController = /** @class */ (function (_super) {
    __extends(NotificationController, _super);
    function NotificationController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotificationController.prototype.getNotifications = function () {
        return this.service.getAll();
    };
    NotificationController.prototype.getNotificationById = function (id) {
        return _super.prototype.getById.call(this, id);
    };
    NotificationController.prototype.createNotification = function (model) {
        return _super.prototype.create.call(this, model);
    };
    NotificationController.prototype.updateNotification = function (id, model) {
        return _super.prototype.update.call(this, id, model);
    };
    /**
     * @deprecated Use expireAssignment Instead
     *
     * @param {string} id
     * @returns
     * @memberof AssignmentController
     */
    NotificationController.prototype.deleteNotification = function (id, request) {
    };
    __decorate([
        typescript_ioc_1.Inject,
        __metadata("design:type", NotificationService_1.NotificationService)
    ], NotificationController.prototype, "serviceInstance", void 0);
    __decorate([
        tsoa_1.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NotificationController.prototype, "getNotifications", null);
    __decorate([
        tsoa_1.Get('{id}'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], NotificationController.prototype, "getNotificationById", null);
    __decorate([
        tsoa_1.Post(),
        __param(0, tsoa_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], NotificationController.prototype, "createNotification", null);
    __decorate([
        tsoa_1.Put('{id}'),
        __param(0, tsoa_1.Path()), __param(1, tsoa_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], NotificationController.prototype, "updateNotification", null);
    __decorate([
        tsoa_1.Delete('{id}'),
        __param(0, tsoa_1.Path()), __param(1, tsoa_1.Request()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], NotificationController.prototype, "deleteNotification", null);
    NotificationController = __decorate([
        tsoa_1.Route('Notifications'),
        authentication_1.Security('jwt'),
        typescript_ioc_1.AutoWired
    ], NotificationController);
    return NotificationController;
}(ControllerBase_1.default));
exports.NotificationController = NotificationController;
//# sourceMappingURL=C:/Dev/carma-api/dist/controllers/NotificationController.js.map