import { NotificationEvent } from '../models/Notification';
import { ServiceBase } from '../infrastructure/ServiceBase';
export declare class NotificationService extends ServiceBase<NotificationEvent> {
    fieldMap: {
        assignment_id: string;
        title: string;
        location_id: string;
        courtroom_id: string;
        escort_run_id: string;
        jail_role_code: string;
        other_assign_code: string;
        work_section_code: string;
        court_role_code: string;
    };
    constructor();
    getById(id: string): Promise<NotificationEvent>;
    getAll(): Promise<NotificationEvent[]>;
    update(entity: Partial<NotificationEvent>): Promise<NotificationEvent>;
    private validateNotification;
    create(entity: Partial<NotificationEvent>): Promise<NotificationEvent>;
    delete(id: string): Promise<void>;
}
