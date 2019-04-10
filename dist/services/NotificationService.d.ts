import { NotificationEvent, NotificationEventResponse } from '../models/Notification';
import { ServiceBase } from '../infrastructure/ServiceBase';
export declare class NotificationService extends ServiceBase<NotificationEvent> {
    constructor();
    sendNotificationEvent(entity: NotificationEvent): Promise<NotificationEventResponse>;
}
