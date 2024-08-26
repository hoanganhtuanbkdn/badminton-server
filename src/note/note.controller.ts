// note.controller.ts
import { Controller, Delete, Get, Param, Patch, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiParam, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from 'src/auth';
import { ROLE } from 'src/auth/constants/role.constant';
import { NoteService } from './note.service';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { GetNotesDto } from './dtos/get-notes.dto';
import { Request } from 'express';

@ApiTags('note')
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({ status: 201, description: 'The note has been successfully created.', type: Note })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createNoteDto: CreateNoteDto, @Req() req: Request): Promise<Note> {
    const userId = (req.user as any).id;
    return this.noteService.create(createNoteDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notes with pagination and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of notes per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Return all notes with pagination and sorting.', type: [Note] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query() getNotesDto: GetNotesDto): Promise<{ data: Note[]; total: number }> {
    return this.noteService.findAll(getNotesDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiParam({ name: 'id', description: 'ID of the note to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the note.', type: Note })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  findOne(@Param('id') id: string): Promise<Note> {
    return this.noteService.findOne(id);
  }

  @Get('lead/:leadId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notes by lead ID with pagination and sorting' })
  @ApiParam({ name: 'leadId', description: 'ID of the lead to retrieve notes for' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of notes per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Return the notes for the specified lead with pagination and sorting.', type: [Note] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Lead not found.' })
  findByLeadId(@Param('leadId') leadId: string, @Query() getNotesDto: GetNotesDto): Promise<{ data: Note[]; total: number }> {
    return this.noteService.findByLeadId(leadId, getNotesDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({ name: 'id', description: 'ID of the note to update' })
  @ApiBody({ type: UpdateNoteDto })
  @ApiResponse({ status: 200, description: 'The note has been successfully updated.', type: Note })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto): Promise<Note> {
    console.log('updateNoteDto', updateNoteDto);
    return this.noteService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', description: 'ID of the note to delete' })
  @ApiResponse({ status: 204, description: 'The note has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.noteService.remove(id);
  }
}
