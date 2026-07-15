import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    stream(user: any): Observable<MessageEvent>;
    getUnread(user: any): Promise<import("./notifications.service").NotificationPayload[]>;
    markRead(user: any): Promise<{
        success: boolean;
    }>;
    broadcast(body: {
        type: string;
        title: string;
        message: string;
        userId?: string;
    }): Promise<import("./notifications.service").NotificationPayload>;
}
