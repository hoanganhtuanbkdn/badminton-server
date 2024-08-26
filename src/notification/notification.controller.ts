import { Controller, Delete, Get, Param, Patch, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiParam, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from 'src/auth';
import { ROLE } from 'src/auth/constants/role.constant';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { GetNotificationsDto } from './dtos/get-notifications.dto';
import { Request } from 'express';
import { CreateNotificationDto } from './dtos/create-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user notifications with pagination and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of notifications per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Return all notifications for the user with pagination and sorting.', type: [Notification] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query() getNotificationsDto: GetNotificationsDto, @Req() req: Request): Promise<{ data: Notification[]; total: number }> {
    const userId = (req.user as any).id;
    return this.notificationService.findAll(getNotificationsDto, userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a notification by ID' })
  @ApiParam({ name: 'id', description: 'ID of the notification to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the notification.', type: Notification })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a notification' })
  @ApiParam({ name: 'id', description: 'ID of the notification to update' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({ status: 200, description: 'The notification has been successfully updated.', type: Notification })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  update(@Param('id') id: string, @Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationService.update(id, createNotificationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', description: 'ID of the notification to delete' })
  @ApiResponse({ status: 204, description: 'The notification has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.notificationService.remove(id);
  }

  @Post('read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark notifications as read' })
  @ApiBody({ type: [String], description: 'Array of notification IDs to mark as read' })
  @ApiResponse({ status: 200, description: 'The notifications have been marked as read.', type: [Notification] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  markAsRead(@Body() notificationIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.notificationService.markAsRead(notificationIds);
  }
}
