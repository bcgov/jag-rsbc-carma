import { Controller } from 'tsoa';
import { CrudService } from './CrudService';
import { CurrentUser } from './CurrentUser';
export default abstract class ControllerBase<T, TService extends CrudService<T> = CrudService<T>> extends Controller {
    private _currentUser;
    /**
     * The user associated with the current request
     *
     * @readonly
     * @protected
     * @memberof ControllerBase
     */
    protected readonly currentUser: CurrentUser;
    protected serviceInstance: TService;
    readonly service: TService;
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T>;
    create(model: T): Promise<T>;
    update(id: string, model: T): Promise<T>;
    delete(id: string): Promise<void>;
}
