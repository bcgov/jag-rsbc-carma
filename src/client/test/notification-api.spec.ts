import moment from 'moment';
import ApiClient from '../ExtendedClient';
import { NotificationEvent } from '../models';
import TestUtils from './TestUtils';
import { NotificationEventResponse } from '../../models/Notification';

describe('Notification API', () => {
    let api: ApiClient;

    const entityToCreate: NotificationEvent = {
        noticeNumber: "12345",
        correlationId: "54321",
    };

    let createdEntities: NotificationEventResponse[] = [];
    let createdEntity: NotificationEventResponse;

    function getEntity(): NotificationEvent {
        const notif: NotificationEvent = {
            ...entityToCreate,
        }
        return notif;
    }

    beforeAll(async (done) => {
        await TestUtils.setupTestFixtures(async client => {
        });
        api = TestUtils.getClientWithAuth();
        done();
    });

    describe('Operations', async () => {

        it('create notification event', async () => {
            createdEntity = await api.CreateNotification({ ...getEntity() });
            expect(createdEntity).toBeDefined();
            expect(createdEntity.respCd).toEqual(0);
            expect(createdEntity.respMsg).toEqual("success");

            createdEntities.push(createdEntity);
        });
    });
}) 