// src/attachment/attachment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
  ) { }

  async create(attachments: Partial<Attachment>[]): Promise<Attachment[]> {
    const attachmentEntities = this.attachmentRepository.create(attachments);
    return this.attachmentRepository.save(attachmentEntities);
  }

  async deleteByEmailHistoryId(emailHistoryId: string): Promise<void> {
    await this.attachmentRepository.delete({ emailHistoryId });
  }

  async replaceAttachmentsByEmailHistoryId(
    emailHistoryId: string,
    newAttachments: Partial<Attachment>[],
  ): Promise<Attachment[]> {
    await this.deleteByEmailHistoryId(emailHistoryId);
    if (newAttachments?.length) {
      const attachmentsWithHistoryId = newAttachments.map(attachment => ({
        ...attachment,
        emailHistoryId,
      }));

      return this.create(attachmentsWithHistoryId);
    }
  }
}
