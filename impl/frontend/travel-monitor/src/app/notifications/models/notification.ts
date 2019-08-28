import { NotificationType } from './notification-type';

export interface Notification {
    id: number;
    user: number; // user id;
    readed: string; // datetime when readed
    event: {
        id: number;
        timestamp: string;
        author: number; // user id
        type: NotificationType;
        title: string;
        message: string;
        data: any; // TODO create a standard type for notification data payload
    }
}