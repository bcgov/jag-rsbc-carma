import { NotificationEvent } from '../models/Notification';
import { NotificationService } from '../services/NotificationService';
import ControllerBase from '../infrastructure/ControllerBase';
import { Request as KoaRequest } from 'koa';
export declare class NotificationController extends ControllerBase<NotificationEvent, NotificationService> {
    protected serviceInstance: NotificationService;
    getNotifications(): Promise<NotificationEvent[]>;
    getNotificationById(id: string): Promise<NotificationEvent>;
    createNotification(model: NotificationEvent): Promise<NotificationEvent>;
    updateNotification(id: string, model: NotificationEvent): Promise<NotificationEvent>;
    /**
     * @deprecated Use expireAssignment Instead
     *
     * @param {string} id
     * @returns
     * @memberof AssignmentController
     */
    deleteNotification(id: string, request: KoaRequest): void;
}
