import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { TimeSlotsService } from './timeslots.service';
import { CreateTimeSlotDto, UpdateTimeSlotDto, GetTimeSlotsDto, SortOrder } from './dto';
import { TimeSlot } from './timeslots.entity';

@ApiTags('timeslots')
@Controller('timeslots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new time slot' })
  @ApiBody({ type: CreateTimeSlotDto })
  @ApiResponse({ status: 201, description: 'The time slot has been successfully created.', type: TimeSlot })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTimeSlotDto: CreateTimeSlotDto): Promise<TimeSlot> {
    return this.timeSlotsService.create(createTimeSlotDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all timeslots with pagination, sorting, and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder, description: 'Sort order' })
  @ApiQuery({ name: 'unitId', required: false, description: 'Filter by unit ID' })
  @ApiResponse({ status: 200, description: 'Return all timeslots with pagination, sorting, and filtering.', type: [TimeSlot] })
  findAll(@Query() getTimeSlotsDto: GetTimeSlotsDto): Promise<{ data: TimeSlot[]; total: number; page: number; limit: number }> {
    return this.timeSlotsService.findAll(getTimeSlotsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a time slot by ID' })
  @ApiParam({ name: 'id', description: 'ID of the time slot to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the time slot.', type: TimeSlot })
  @ApiResponse({ status: 404, description: 'Time slot not found.' })
  findOne(@Param('id') id: string): Promise<TimeSlot> {
    return this.timeSlotsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a time slot' })
  @ApiParam({ name: 'id', description: 'ID of the time slot to update' })
  @ApiBody({ type: UpdateTimeSlotDto })
  @ApiResponse({ status: 200, description: 'The time slot has been successfully updated.', type: TimeSlot })
  @ApiResponse({ status: 404, description: 'Time slot not found.' })
  update(@Param('id') id: string, @Body() updateTimeSlotDto: UpdateTimeSlotDto): Promise<TimeSlot> {
    return this.timeSlotsService.update(id, updateTimeSlotDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a time slot' })
  @ApiParam({ name: 'id', description: 'ID of the time slot to delete' })
  @ApiResponse({ status: 204, description: 'The time slot has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Time slot not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.timeSlotsService.remove(id);
  }
}
