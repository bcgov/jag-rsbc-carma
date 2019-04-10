export interface NotificationEventResponse {
    respCd?: number;
    respMsg?: string;
}
export interface NotificationEvent {
    correlationId?: string;
    noticeNumber?: string;
    noticeTypeCd?: string;
    eventTypeCd?: string;
    eventDt?: string;
}
