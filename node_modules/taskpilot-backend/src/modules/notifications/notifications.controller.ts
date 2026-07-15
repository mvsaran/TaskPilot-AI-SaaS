import { Controller, Get, Post, Sse, UseGuards, MessageEvent, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications & Live Stream')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse('stream')
  @ApiOperation({ summary: 'Server-Sent Events (SSE) stream for real-time task and sprint updates' })
  stream(@CurrentUser() user: any): Observable<MessageEvent> {
    return this.notificationsService.subscribeToUserNotifications(user?.id || 'global');
  }

  @Get('unread')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get unread real-time notifications (polling fallback)' })
  async getUnread(@CurrentUser() user: any) {
    return this.notificationsService.getUnread(user?.id || 'global');
  }

  @Post('mark-read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Mark all user notifications as read' })
  async markRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllRead(user?.id || 'global');
  }

  @Post('broadcast')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Emit real-time workspace broadcast notification' })
  async broadcast(@Body() body: { type: string; title: string; message: string; userId?: string }) {
    return this.notificationsService.emitNotification(body.userId || 'global', body.type, body.title, body.message);
  }
}
