import { CrudService } from "./CrudService";
import { CurrentUser } from './CurrentUser';
export declare abstract class ServiceBase<T> extends CrudService<T> {
    private _currentUser;
    protected currentUser(): CurrentUser;
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | undefined>;
    create(entity: Partial<T>): Promise<T>;
    update(entity: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
    generateUuid(): string;
    filterNullValues<T>(object: any): T;
}
