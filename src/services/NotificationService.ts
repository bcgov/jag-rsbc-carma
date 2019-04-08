import { NotificationEvent } from '../models/Notification';
import moment from 'moment';
import { ValidateError, FieldErrors } from 'tsoa';
import { ClientBase } from 'pg';
import { AutoWired, Inject, Container } from 'typescript-ioc';
import { ServiceBase } from '../infrastructure/ServiceBase';

@AutoWired
export class NotificationService extends ServiceBase<NotificationEvent> {

    fieldMap = {
        assignment_id: 'id',
        title: 'title',
        location_id: 'locationId',
        courtroom_id: 'courtroomId',
        escort_run_id: 'escortRunId',
        jail_role_code: 'jailRoleCode',
        other_assign_code: 'otherAssignCode',
        work_section_code: 'workSectionId',
        court_role_code: 'courtRoleId'
    };

    constructor() {
        super();
    }

    async getById(id: string) {
        return <NotificationEvent>{};
    }

    async getAll(): Promise<NotificationEvent[]> {
        return <NotificationEvent[]>[];
    }

    async update(entity: Partial<NotificationEvent>): Promise<NotificationEvent> {
        return <NotificationEvent>{};
    }

    private validateNotification(entity: Partial<NotificationEvent>) {
    }

    async create(entity: Partial<NotificationEvent>): Promise<NotificationEvent> {
        this.validateNotification(entity);
        return <NotificationEvent>{};
    }

    async delete(id: string): Promise<void> {
    }
}