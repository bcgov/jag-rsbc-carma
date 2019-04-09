import { NotificationEvent, NotificationEventResponse } from '../models/Notification';
import { AutoWired } from 'typescript-ioc';
import { ServiceBase } from '../infrastructure/ServiceBase';
import * as request from "request-promise-native";

@AutoWired
export class NotificationService extends ServiceBase<NotificationEvent> {

    constructor() {
        super();
    }

    async sendNotificationEvent(entity: NotificationEvent): Promise<NotificationEventResponse> {
        let auth = `Basic ${new Buffer(`${process.env.CARMA_USERNAME}:${process.env.CARMA_PASSWORD}`).toString("base64")}`;
        return new Promise<NotificationEventResponse>((resolve) => {
            request.post({
                url: process.env.CARMA_URL!, 
                headers: { Authorization: auth } 
            }).then(result => {
                console.log(result);
                resolve({
                    respCd: 0,
                    respMsg: "success"
                });
            }).catch(error => {
                resolve({
                    respCd: 1,
                    respMsg: JSON.stringify(error)
                });
            });
        });
    }
}