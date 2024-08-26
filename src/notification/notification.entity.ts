import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn, BeforeInsert, JoinColumn } from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import { IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Lead } from 'src/lead/entities/lead.entity';

@Entity()
export class Notification {
  @ApiProperty({ description: 'ID of the notification', example: 'uuid-v4' })
  @PrimaryColumn({ name: 'id', length: 45, type: 'varchar' })
  id: string;

  @ApiProperty({ description: 'ID of the user who receives the notification' })
  @Column({ name: 'user_id', length: 200 })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Content of the notification', example: '{{leadId}} sent you an email' })
  @Column({ name: 'content', type: 'text' })
  content: string;

  @ApiPropertyOptional({ description: 'Read status of the notification', example: false })
  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @ApiPropertyOptional({ description: 'Time when the notification was read' })
  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt: Date;

  @ApiPropertyOptional({ description: 'Lead that sent the notification', type: () => Lead })
  @ManyToOne(() => Lead, { nullable: true })
  @JoinColumn({ name: 'lead_id' })
  lead?: Lead;

  @ApiProperty({ description: 'ID of the lead that sent the notification' })
  @Column({ name: 'lead_id', length: 200 })
  @IsString()
  leadId: string;

  @ApiProperty({ description: 'Creation date of the notification' })
  @CreateDateColumn({ name: 'created_at', nullable: true, default: "" })
  createdAt: Date;

  @BeforeInsert()
  async generateId() {
    this.id = uuid4();
  }
}
