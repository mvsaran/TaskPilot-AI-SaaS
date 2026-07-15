import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';
export interface NotificationPayload {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
}
export declare class NotificationsService {
    private readonly prisma;
    private eventStream;
    private mockNotifications;
    constructor(prisma: PrismaService);
    subscribeToUserNotifications(userId: string): Observable<MessageEvent>;
    getUnread(userId: string): Promise<NotificationPayload[]>;
    markAllRead(userId: string): Promise<{
        success: boolean;
    }>;
    emitNotification(userId: string, type: string, title: string, message: string): NotificationPayload;
}
