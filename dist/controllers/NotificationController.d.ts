import { NotificationEvent, NotificationEventResponse } from '../models/Notification';
import { NotificationService } from '../services/NotificationService';
import ControllerBase from '../infrastructure/ControllerBase';
export declare class NotificationController extends ControllerBase<NotificationEvent, NotificationService> {
    protected serviceInstance: NotificationService;
    sendNotification(model: NotificationEvent): Promise<NotificationEventResponse>;
}
