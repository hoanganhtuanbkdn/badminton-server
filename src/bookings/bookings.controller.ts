import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, GetBookingsDto, SortOrder } from './dto';
import { Booking } from './bookings.entity';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'The booking has been successfully created.', type: Booking })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createBookingDto: any): Promise<Booking> {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings with pagination, sorting, and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder, description: 'Sort order', example: SortOrder.DESC })
  @ApiQuery({ name: 'customerId', required: false, description: 'Filter by customer ID', example: 'customerId' })
  @ApiQuery({ name: 'courtId', required: false, description: 'Filter by court ID', example: 'courtId' })
  @ApiResponse({ status: 200, description: 'Return all bookings with pagination, sorting, and filtering.', type: [Booking] })
  findAll(@Query() getBookingsDto: GetBookingsDto): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    return this.bookingsService.findAll(getBookingsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiParam({ name: 'id', description: 'ID of the booking to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the booking.', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({ name: 'id', description: 'ID of the booking to update' })
  @ApiBody({ type: UpdateBookingDto })
  @ApiResponse({ status: 200, description: 'The booking has been successfully updated.', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto): Promise<Booking> {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiParam({ name: 'id', description: 'ID of the booking to delete' })
  @ApiResponse({ status: 204, description: 'The booking has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.bookingsService.remove(id);
  }
}
