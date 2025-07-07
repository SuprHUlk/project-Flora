import { Notification } from "./notificationModel";

export interface Response {
    status: number;
    json: any;
    notification?: Notification;
}
