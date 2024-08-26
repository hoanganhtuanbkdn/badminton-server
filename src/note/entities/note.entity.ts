import { AdminProfile } from 'src/admin';
import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, JoinColumn } from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CrudValidationGroups } from '@nestjsx/crud';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Note {
  @ApiProperty({ description: 'ID of the note', example: 'uuid-v4' })
  @PrimaryColumn({ name: 'id', length: 45, type: 'varchar' })
  id: string;

  @ApiProperty({ description: 'Content of the note' })
  @Column()
  content: string;

  @ApiPropertyOptional({ description: 'ID of the creator' })
  @Column({ name: 'creator_id', length: 200 })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsString()
  creatorId: string;

  @ApiPropertyOptional({ description: 'ID of the user who last updated the note' })
  @Column({ name: 'updated_by_id', length: 200, nullable: true })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsString()
  updatedById: string;


  @ApiProperty({ description: 'ID of the lead this note belongs to' })
  @Column({ name: 'lead_id', })
  leadId: string;

  @ApiProperty({ description: 'ID of the parent this note belongs to' })
  @Column({ name: 'parent_note_id', nullable: true })
  parentNoteId: string;

  @ApiPropertyOptional({ description: 'Parent note of this note', type: () => Note })
  @ManyToOne(() => Note, note => note.replies)
  @JoinColumn({ name: 'parent_note_id' })
  parentNote: Note;

  @ApiPropertyOptional({ description: 'Replies to this note', type: () => [Note] })
  @OneToMany(() => Note, note => note.parentNote)
  replies: Note[];

  @ApiProperty({ description: 'Creation date of the note' })
  @CreateDateColumn({ name: 'created_at', nullable: true, default: "" })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the note' })
  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: "" })
  updatedAt: Date;

  @BeforeInsert()
  async generateId() {
    const uuid = uuid4();
    this.id = uuid;
  }
}
