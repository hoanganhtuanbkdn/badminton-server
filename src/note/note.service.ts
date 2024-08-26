import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { AdminProfile } from 'src/admin';
import { Lead } from 'src/lead/entities/lead.entity';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { GetNotesDto } from './dtos/get-notes.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    @InjectRepository(AdminProfile)
    private adminProfileRepository: Repository<AdminProfile>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) { }

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const creator = await this.adminProfileRepository.findOne({ where: { id: userId } });
    if (!creator) {
      throw new UnauthorizedException('Invalid user');
    }
    const lead = await this.leadRepository.findOne({ where: { id: createNoteDto.leadId, } });
    const parentNote = createNoteDto.parentNoteId ? await this.noteRepository.findOne({ where: { id: createNoteDto.parentNoteId } }) : null;

    const note = new Note();
    note.content = createNoteDto.content;
    note.creator = creator;
    note.lead = lead;
    note.parentNote = parentNote;

    return this.noteRepository.save(note);
  }

  async findAll(getNotesDto: GetNotesDto): Promise<{ data: Note[]; total: number, page: number, limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = getNotesDto;

    const [data, total] = await this.noteRepository.findAndCount({
      where: { parentNoteId: IsNull() },
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['creator'],
    });

    const _data = await Promise.all(data?.map(async (item) => {
      const replies = await this.noteRepository.find({
        where: {
          parentNoteId: item.id
        },
        relations: ['creator'],
      });

      return {
        ...item, replies
      };
    }));

    return { data: _data as Note[], total, page, limit };
  }

  async findByLeadId(leadId: string, getNotesDto: GetNotesDto): Promise<{ data: Note[]; total: number, page: number, limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = getNotesDto;

    const [data, total] = await this.noteRepository.findAndCount({
      where: { leadId, parentNoteId: IsNull() },
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['creator'],
    });

    const _data = await Promise.all(data?.map(async (item) => {
      const replies = await this.noteRepository.find({
        where: {
          parentNoteId: item.id
        },
        relations: ['creator'],
      });

      return {
        ...item, replies
      };
    }));

    return { data: _data as Note[], total, page, limit };
  }

  async findOne(id: string): Promise<Note> {
    return this.noteRepository.findOne({ where: { id } });
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteRepository.findOne({ where: { id } });
    if (updateNoteDto.content) {
      note.content = updateNoteDto.content;
    }
    if (updateNoteDto.creatorId) {
      const creator = await this.adminProfileRepository.findOne({ where: { id: updateNoteDto.creatorId } });
      note.creator = creator;
    }
    if (updateNoteDto.leadId) {
      const lead = await this.leadRepository.findOne({ where: { id: updateNoteDto.leadId } });
      note.lead = lead;
    }
    if (updateNoteDto.parentNoteId) {
      const parentNote = await this.noteRepository.findOne({
        where: {
          id: updateNoteDto.parentNoteId
        }
      });
      note.parentNote = parentNote;
    }
    return this.noteRepository.save(note);
  }

  async remove(id: string): Promise<void> {
    const note = await this.noteRepository.findOne({ where: { id }, relations: ['replies'] });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.replies && note.replies.length > 0) {
      for (const reply of note.replies) {
        await this.remove(reply.id);  // recursively delete replies
      }
    }

    await this.noteRepository.delete(id);
  }
}
