import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { AdminProfile } from 'src/admin';
import { Lead } from 'src/lead/entities/lead.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, AdminProfile, Lead])],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule { }
