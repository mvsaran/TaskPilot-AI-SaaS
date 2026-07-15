import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
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

@Injectable()
export class NotificationsService {
  private eventStream = new Subject<NotificationPayload>();
  private mockNotifications: NotificationPayload[] = [
    {
      id: 'notif-1',
      userId: 'global',
      type: 'AI_REPORT_READY',
      title: 'Sprint 2 Burndown Analysis Ready',
      message: 'TaskPilot AI has completed velocity prediction for active sprint.',
      createdAt: new Date().toISOString(),
      read: false,
    },
    {
      id: 'notif-2',
      userId: 'global',
      type: 'TASK_ASSIGNED',
      title: 'New High Priority Task Assigned',
      message: 'Alex Rivera assigned you TSK-1004: Optimize Redis cache TTL.',
      createdAt: new Date().toISOString(),
      read: false,
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  subscribeToUserNotifications(userId: string): Observable<MessageEvent> {
    return this.eventStream.asObservable().pipe(
      filter(payload => payload.userId === userId || payload.userId === 'global'),
      map(payload => ({
        data: JSON.stringify(payload),
        type: payload.type,
      })),
    );
  }

  async getUnread(userId: string) {
    return this.mockNotifications.filter(n => (n.userId === userId || n.userId === 'global') && !n.read);
  }

  async markAllRead(userId: string) {
    this.mockNotifications.forEach(n => {
      if (n.userId === userId || n.userId === 'global') {
        n.read = true;
      }
    });
    return { success: true };
  }

  emitNotification(userId: string, type: string, title: string, message: string) {
    const payload: NotificationPayload = {
      id: `notif-${Date.now()}`,
      userId,
      type,
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    this.mockNotifications.unshift(payload);
    this.eventStream.next(payload);
    return payload;
  }
}
