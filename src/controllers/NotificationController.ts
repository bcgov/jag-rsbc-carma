import { Body, Delete, Get, Path, Post, Put, Query, Route, Request } from 'tsoa';
import { NotificationEvent, NotificationEventResponse } from '../models/Notification';
import { NotificationService } from '../services/NotificationService';
import ControllerBase from '../infrastructure/ControllerBase';
import {Request as KoaRequest} from 'koa';
import { Security } from '../authentication';
import { AutoWired, Inject } from 'typescript-ioc';
import * as request from "request-promise-native";

@Route('Notifications')
//@Security('jwt')
@AutoWired
export class NotificationController extends ControllerBase<NotificationEvent, NotificationService> {
    @Inject
    protected serviceInstance!:NotificationService;

    @Get()
    public getNotifications() {
        return this.service.getAll();
    }

    @Get('{id}')
    public getNotificationById(id: string) {
        return super.getById(id);
    }

    @Post()
    public async createNotification(@Body() model: NotificationEvent) : Promise<NotificationEventResponse>  {
        console.log(model);
        return new Promise<NotificationEventResponse>((resolve) => {
            request
            .post('https://wsgw.dev.jag.gov.bc.ca/carma/cases', {})
            .then(result => {
                console.log(result);

                resolve({
                    respCd: 0,
                    respMsg: "success"
                });
            })
            .catch(error => {
                
                resolve({
                    respCd: 1,
                    respMsg: JSON.stringify(error)
                });
            });
        });
    }

    @Put('{id}')
    public updateNotification(@Path() id: string, @Body() model: NotificationEvent) {
        return super.update(id, model);
    }
    
    /**
     * @deprecated Use expireAssignment Instead
     *
     * @param {string} id
     * @returns
     * @memberof AssignmentController
     */
    @Delete('{id}')
    public deleteNotification(@Path() id: string, @Request() request:KoaRequest) {
    }
}