enum EventName {
    "letterReceived",
    "letterAccepted",
}

interface Notification {
    eventName: EventName;
    message: string;
    senders?: string[];
    receivers: string[];
}

function getEventNameString(eventName: EventName): string {
    return EventName[eventName];
}

export { Notification, EventName, getEventNameString };
