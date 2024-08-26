import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { TimeSlotsService } from './timeslots.service';
import { CreateTimeSlotDto, UpdateTimeSlotDto, GetTimeSlotsDto, SortOrder } from './dto';
import { TimeSlot } from './timeslots.entity';

@ApiTags('timeslots')
@Controller('timeslots')
export class TimeSlotsController {
  constructor(private readonly TimeSlotsService: TimeSlotsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new timeslot' })
  @ApiBody({ type: CreateTimeSlotDto })
  @ApiResponse({ status: 201, description: 'The timeslot has been successfully created.', type: TimeSlot })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTimeSlotDto: CreateTimeSlotDto): Promise<TimeSlot> {
    return this.TimeSlotsService.create(createTimeSlotDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all timeslots with pagination, sorting, and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder, description: 'Sort order', example: SortOrder.DESC })
  @ApiQuery({ name: 'unitId', required: false, description: 'Filter by unit ID', example: 'unitId' })
  @ApiResponse({ status: 200, description: 'Return all timeslots with pagination, sorting, and filtering.', type: [TimeSlot] })
  findAll(@Query() getTimeSlotsDto: GetTimeSlotsDto): Promise<{ data: TimeSlot[]; total: number; page: number; limit: number }> {
    return this.TimeSlotsService.findAll(getTimeSlotsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a timeslot by ID' })
  @ApiParam({ name: 'id', description: 'ID of the timeslot to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the timeslot.', type: TimeSlot })
  @ApiResponse({ status: 404, description: 'Timeslot not found.' })
  findOne(@Param('id') id: string): Promise<TimeSlot> {
    return this.TimeSlotsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a timeslot' })
  @ApiParam({ name: 'id', description: 'ID of the timeslot to update' })
  @ApiBody({ type: UpdateTimeSlotDto })
  @ApiResponse({ status: 200, description: 'The timeslot has been successfully updated.', type: TimeSlot })
  @ApiResponse({ status: 404, description: 'Timeslot not found.' })
  update(@Param('id') id: string, @Body() updateTimeSlotDto: UpdateTimeSlotDto): Promise<TimeSlot> {
    return this.TimeSlotsService.update(id, updateTimeSlotDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a timeslot' })
  @ApiParam({ name: 'id', description: 'ID of the timeslot to delete' })
  @ApiResponse({ status: 204, description: 'The timeslot has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Timeslot not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.TimeSlotsService.remove(id);
  }
}
