// src/attachment/entities/attachment.entity.ts
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { EmailHistory } from '../../email-history/entities/email-history.entity';

@Entity()
export class Attachment {

  @PrimaryColumn({ name: 'id', length: 45, type: 'varchar' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  contentType: string;

  @Column({ type: 'text' })
  contentBytes: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => EmailHistory, (emailHistory) => emailHistory.attachments, { onDelete: 'CASCADE' })
  emailHistory: EmailHistory;

  @Column()
  emailHistoryId: string;
}
