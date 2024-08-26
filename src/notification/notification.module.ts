import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from 'src/lead/entities/lead.entity';
import { Notification } from './notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Lead])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule { }
