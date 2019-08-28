import { NotificationType } from './notification-type';

export interface NotificationsFilter {
    id: number,
    user: number,
    types_enabled: NotificationType[]
}