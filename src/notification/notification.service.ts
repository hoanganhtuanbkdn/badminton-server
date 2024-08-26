import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UpdateResult } from 'typeorm';
import { Notification } from './notification.entity';
import { GetNotificationsDto } from './dtos/get-notifications.dto';
import { CreateNotificationDto } from './dtos/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,

  ) { }

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {

    const result = await this.notificationRepository.create(createNotificationDto);
    return this.notificationRepository.save(result);
  }

  async findAll(getNotificationsDto: GetNotificationsDto, userId: string): Promise<{ data: Notification[]; total: number, page: number, limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = getNotificationsDto;

    const [data, total] = await this.notificationRepository.findAndCount({
      where: { userId },
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['lead'],
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id }, relations: ['lead'] });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async update(id: string, updateNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.notificationRepository.save(notification);
  }

  async remove(id: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    await this.notificationRepository.delete(id);
  }

  async markAsRead(notificationIds: string[]): Promise<{ success: boolean; message: string }> {
    const result = await this.notificationRepository.update(
      { id: In(notificationIds) },
      { isRead: true, readAt: new Date() },
    );

    if (result.affected > 0) {
      return {
        success: true,
        message: `${result.affected} notifications marked as read.`,
      };
    } else {
      return {
        success: false,
        message: 'No notifications were marked as read.',
      };
    }
  }
}
