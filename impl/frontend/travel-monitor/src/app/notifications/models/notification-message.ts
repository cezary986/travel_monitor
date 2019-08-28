import { Notification } from './notification';

export interface NotificationMessage {
    action: 'new' | 'readed',
    notification: Notification
}