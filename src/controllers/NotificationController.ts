import { Body, Post, Route } from 'tsoa';
import { NotificationEvent, NotificationEventResponse } from '../models/Notification';
import { NotificationService } from '../services/NotificationService';
import ControllerBase from '../infrastructure/ControllerBase';
import { Security } from '../authentication';
import { AutoWired, Inject } from 'typescript-ioc';

@Route('Notifications')
@Security('basic')
@AutoWired
export class NotificationController extends ControllerBase<NotificationEvent, NotificationService> {
    @Inject
    protected serviceInstance!:NotificationService;

    @Post()
    public async sendNotification(@Body() model: NotificationEvent) : Promise<NotificationEventResponse>  {
        console.log(model);
        return this.serviceInstance.sendNotificationEvent(model);
    }
}