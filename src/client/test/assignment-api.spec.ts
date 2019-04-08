import moment from 'moment';
import ApiClient from '../ExtendedClient';
import { NotificationEvent } from '../models';
import TestUtils from './TestUtils';
import { ERROR_DEPRECATED_DELETE_ASSIGNMENT } from '../../common/Messages';

describe('Assignment API', () => {
    let api: ApiClient;

    const entityToCreate: NotificationEvent = {
        noticeNumber: "12345",
        correlationId: "54321",
    };

    let createdEntities: NotificationEvent[] = [];
    let createdEntity: NotificationEvent;

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
            createdEntity = await api.CreateAssignment({ ...getEntity() });
            expect(createdEntity).toBeDefined();
            expect(createdEntity.id).toBeDefined();
            expect(createdEntity.locationId).toEqual(testLocation.id);
            expect(createdEntity).toEqual({
                ...createdEntity,
                ...entityToCreate,
                locationId: testLocation.id
            });

            createdEntities.push(createdEntity);
        });

        it('create with duty recurrences should return new assignment with duty recurrences', async () => {
            createdEntityWithRecurrence = await api.CreateAssignment({
                ...getEntity(),
                dutyRecurrences: [
                    { ...recurrenceToCreate }
                ]
            });

            expect(createdEntityWithRecurrence).toBeDefined();
            expect(createdEntityWithRecurrence.dutyRecurrences).toBeDefined();
            expect(createdEntityWithRecurrence.dutyRecurrences.length).toEqual(1);
            const createdRecurrence = createdEntityWithRecurrence.dutyRecurrences[0];

            // Check the shape of the object returned
            expect(createdRecurrence).toMatchShapeOf(recurrenceShape);
            // check assignment id and effective date
            expect(createdRecurrence.assignmentId).toEqual(createdEntityWithRecurrence.id);

            // check that all values are same as those created
            TestUtils.assertDutyRecurrence(createdRecurrence, recurrenceToCreate);
            createdEntities.push(createdEntityWithRecurrence);
        });

        it('get by id should return Assignment', async () => {
            const retrieved = await api.GetAssignmentById(createdEntity.id);
            expect(retrieved).toMatchObject(createdEntity);
            const retrievedWithRecurrence = await api.GetAssignmentById(createdEntityWithRecurrence.id);
            expect(retrievedWithRecurrence).toMatchObject(createdEntityWithRecurrence);
        });

        it('get List should return list of Assignments', async () => {
            const list = await api.GetAssignments();
            expect(list).toBeDefined();
            expect(Array.isArray(list)).toBeTruthy();
            expect(list).toEqual(expect.arrayContaining(createdEntities));
        });

        it('get list should return only those Assignments in location if specified', async () => {
            const secondTestLocation = { ...testLocation }
            delete secondTestLocation['id'];
            secondTestLocation.name = "Test Location 2";
            secondTestLocation.code = TestUtils.randomString(5);
            const secondLocation = await api.CreateLocation(secondTestLocation);
            const secondEntity = await api.CreateAssignment({
                ...getEntity(),
                name: "second Assignment",
                locationId: secondLocation.id
            } as Assignment);
            createdEntities.push(secondEntity);

            let list = await api.GetAssignments();
            expect(list).toEqual(expect.arrayContaining(createdEntities));

            list = await api.GetAssignments(secondLocation.id);
            expect(list).toEqual(expect.arrayContaining([secondEntity]));
        });

        it('get list should respect effective dates', async () => {
            const list = await api.GetAssignments(undefined, moment().subtract(1, 'weeks'));
            expect(list).toBeDefined();
            expect(Array.isArray(list)).toBeTruthy();
            expect(list.length).toEqual(0);
        });

        it('expire should set expiry date for assignment and hide from get operation', async () => {
            await api.ExpireAssignment(createdEntity.id);
            const list = await api.GetAssignments();
            expect(list.some(a => a.id === createdEntity.id)).toBeFalsy();
        });

        it('update Assignment should return updated Assignment', async () => {
            const updatedEntity = await api.UpdateAssignment(createdEntity.id, {
                ...createdEntity,
                courtroomId: testCourtroomTwo.id
            } as Assignment);
            expect(updatedEntity).toMatchObject({
                ...createdEntity,
                courtroomId: testCourtroomTwo.id,
                title: testCourtroomTwo.code
            });
        });

        it('update should create/update duty recurrence objects', async () => {
            const additionalRecurrence: DutyRecurrence = {
                ...recurrenceToCreate,
                startTime: "09:00:00",
                endTime: "11:30:00",
                sheriffsRequired: 5
            };
            const recurrenceToUpdate: DutyRecurrence = {
                ...createdEntityWithRecurrence.dutyRecurrences[0],
                endTime: "17:30:00",
                sheriffsRequired: 12
            }
            const updatedEntityWithRecurrence = await api.UpdateAssignment(createdEntity.id, {
                ...createdEntityWithRecurrence,
                locationId: testLocation.id,
                dutyRecurrences: [
                    additionalRecurrence,
                    recurrenceToUpdate
                ]
            });

            expect(updatedEntityWithRecurrence.title).toEqual(testCourtroom.code);
            const recurrences = updatedEntityWithRecurrence.dutyRecurrences;
            expect(Array.isArray(recurrences)).toBeTruthy();
            expect(recurrences.length).toEqual(2);
            expect(recurrences.every(r => r.id != undefined)).toBeTruthy();
            TestUtils.assertDutyRecurrence(recurrences.find(r => r.id === recurrenceToUpdate.id), recurrenceToUpdate);
            const newRecurrence = recurrences.find(r => r.id !== recurrenceToUpdate.id);
            expect(newRecurrence).toMatchShapeOf(recurrenceShape);
            expect(newRecurrence.assignmentId).toEqual(createdEntityWithRecurrence.id);
            TestUtils.assertDutyRecurrence(newRecurrence, additionalRecurrence);
        });

        it('expiring a duty recurrence should hide it from the assignments list but not from get by id', async () => {
            createdEntityWithRecurrence = await api.GetAssignmentById(createdEntityWithRecurrence.id);
            const firstRecurrence = createdEntityWithRecurrence.dutyRecurrences[0];
            const secondRecurrence = createdEntityWithRecurrence.dutyRecurrences[1];
            await api.ExpireDutyRecurrence(firstRecurrence.id);

            const list = await api.GetAssignments();
            const retrieved = list.find(a => a.id === createdEntityWithRecurrence.id);
            expect(retrieved.dutyRecurrences.length).toEqual(1);
            expect(retrieved.dutyRecurrences.find(r => r.id === firstRecurrence.id)).not.toBeDefined();
            expect(retrieved.dutyRecurrences[0]).toEqual(secondRecurrence);

            // When getting assignment by Id, we should grab all of the duty recurrences regardless of expiry
            const retrievedById = await api.GetAssignmentById(createdEntityWithRecurrence.id);
            expect(retrievedById.dutyRecurrences.map(dr => dr.id)).toEqual(expect.arrayContaining(createdEntityWithRecurrence.dutyRecurrences.map(dr => dr.id)));
        });

        it('delete should delete Assignment', async () => {
            await expect(api.DeleteAssignment('some id')).rejects.toEqual(new Error(ERROR_DEPRECATED_DELETE_ASSIGNMENT));
        });
    });

    describe('Different types of assignments', () => {
        let testRun: EscortRun = {
            title: "Test Run",
        }

        let testCourtroom: Courtroom = {
            name: "Testing Courtroom",
            code: TestUtils.randomString(5)
        }
        let testJailRoleCode: JailRoleCode;
        let testOtherAssignCode: OtherAssignCode;
        let testCourtRoleCode: CourtRoleCode;
        let testCourtRoleCodeTwo: CourtRoleCode;

        const entitiesToDelete: Assignment[] = [];

        beforeAll(async (done) => {
            testRun = await api.CreateEscortRun({
                ...testRun,
                locationId: testLocation.id
            });
            testCourtroom = await api.CreateCourtroom({
                ...testCourtroom,
                locationId: testLocation.id
            });
            testJailRoleCode = (await api.GetJailRoleCodes())[0];
            testOtherAssignCode = (await api.GetOtherAssignCodes())[0];
            testCourtRoleCode = (await api.GetCourtRoleCodes())[0];
            testCourtRoleCodeTwo = (await api.GetCourtRoleCodes())[1];
            done();
        });

        it('Court assignment with no courtroom and no court role should throw validation error', async () => {
            await expect(api.CreateAssignment({
                ...entityToCreate,
                workSectionId: "COURTS",
                title: null,
                locationId: testLocation.id
            })).rejects.toMatchObject({
                message: "Invalid Court Assignment",
                name: "ValidateError",
                fields: {
                    "model.courtroomId": {
                        message: "Courtroom or Court Role must be set for Court assignments"
                    }
                }
            });
        });

        it('Court assignment with no title and a courtroom ID should default to courtroom name', async () => {
            let courtAssignment: Assignment = await api.CreateAssignment({
                ...entityToCreate,
                title: null,
                workSectionId: "COURTS",
                locationId: testLocation.id,
                courtroomId: testCourtroom.id
            });
            expect(courtAssignment.id).toBeDefined();
            expect(courtAssignment.workSectionId).toEqual("COURTS");
            expect(courtAssignment.courtroomId).toEqual(testCourtroom.id);
            expect(courtAssignment.title).toEqual(testCourtroom.code);
        });

        it('Court assignment with no title and a court role code should default to court role description', async () => {
            let courtAssignment: Assignment = await api.CreateAssignment({
                ...entityToCreate,
                title: null,
                workSectionId: "COURTS",
                locationId: testLocation.id,
                courtRoleId: testCourtRoleCode.code
            });
            expect(courtAssignment.id).toBeDefined();
            expect(courtAssignment.workSectionId).toEqual("COURTS");
            expect(courtAssignment.courtRoleId).toEqual(testCourtRoleCode.code);
            expect(courtAssignment.title).toEqual(testCourtRoleCode.description);
        });

        it('When assignment is updated the assignment title should be updated', async () => {
            let courtAssignment: Assignment = await api.CreateAssignment({
                ...entityToCreate,
                title: null,
                workSectionId: "COURTS",
                locationId: testLocation.id,
                courtRoleId: testCourtRoleCode.code
            });
            expect(courtAssignment.id).toBeDefined();
            expect(courtAssignment.workSectionId).toEqual("COURTS");
            expect(courtAssignment.courtRoleId).toEqual(testCourtRoleCode.code);
            expect(courtAssignment.title).toEqual(testCourtRoleCode.description);

            let updatedCourtAssignment: Assignment = await api.UpdateAssignment(courtAssignment.id, {
                ...courtAssignment,
                courtRoleId: testCourtRoleCodeTwo.code
            });

            expect(updatedCourtAssignment.id).toBeDefined();
            expect(updatedCourtAssignment.workSectionId).toEqual("COURTS");
            expect(updatedCourtAssignment.courtRoleId).toEqual(testCourtRoleCodeTwo.code);
            expect(updatedCourtAssignment.title).toEqual(testCourtRoleCodeTwo.description);
        });

        it('Jail assignment with no jail should throw validation error', async () => {
            await expect(api.CreateAssignment({
                ...entityToCreate,
                workSectionId: "JAIL",
                title: null,
                locationId: testLocation.id
            })).rejects.toMatchObject({
                message: "Invalid Jail Assignment",
                name: "ValidateError",
                fields: {
                    "model.jailRoleCode": {
                        message: "Jail Role must be set for Jail assignments"
                    }
                }
            });
        });


        it('Jail assignment with no title should default to Jail Role description', async () => {
            const jailAssignment: Assignment = {
                ...entityToCreate,
                title: null,
                workSectionId: "JAIL",
                locationId: testLocation.id,
                jailRoleCode: testJailRoleCode.code
            }

            let assignment: Assignment = await api.CreateAssignment(jailAssignment);
            expect(assignment.id).toBeDefined();
            expect(assignment.workSectionId).toEqual("JAIL");
            expect(assignment.jailRoleCode).toEqual(testJailRoleCode.code);
            expect(assignment.title).toEqual(testJailRoleCode.description);
        });

        it('Escort assignment with no run should throw validation error', async () => {
            await expect(api.CreateAssignment({
                ...entityToCreate,
                workSectionId: "ESCORTS",
                title: null,
                locationId: testLocation.id
            })).rejects.toMatchObject({
                message: "Invalid Escort Assignment",
                name: "ValidateError",
                fields: {
                    "model.escortRunId": {
                        message: "Escort Run must be set for Escort assignments"
                    }
                }
            });
        });

        it('Escort assignment with no title should default to EscortRun Name', async () => {
            let assignment: Assignment = await api.CreateAssignment({
                ...entityToCreate,
                title: null,
                workSectionId: "ESCORTS",
                locationId: testLocation.id,
                escortRunId: testRun.id
            });
            expect(assignment.id).toBeDefined();
            expect(assignment.workSectionId).toEqual("ESCORTS");
            expect(assignment.escortRunId).toEqual(testRun.id);
            expect(assignment.title).toEqual(testRun.title);
        });


        it('Other assignment with no other assignment type should throw validation error', async () => {
            await expect(api.CreateAssignment({
                ...entityToCreate,
                workSectionId: "OTHER",
                title: null,
                locationId: testLocation.id
            })).rejects.toMatchObject({
                message: "Invalid Other Assignment",
                name: "ValidateError",
                fields: {
                    "model.otherAssignCode": {
                        message: "Assignment Type must be set for Other assignments"
                    }
                }
            });
        });

        it('Other assignment with no title should default to Other Assignment Type Name', async () => {
            let assignment: Assignment = await api.CreateAssignment({
                ...entityToCreate,
                title: null,
                workSectionId: "OTHER",
                locationId: testLocation.id,
                otherAssignCode: testOtherAssignCode.code
            });
            expect(assignment.id).toBeDefined();
            expect(assignment.workSectionId).toEqual("OTHER");
            expect(assignment.otherAssignCode).toEqual(testOtherAssignCode.code);
            expect(assignment.title).toEqual(testOtherAssignCode.description);
        });

    })
}) 