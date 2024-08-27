import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { CreateBookingDetailDto, UpdateBookingDetailDto, GetBookingDetailsDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { BookingDetail } from './booking-details.entity';

@ApiTags('booking-details')
@Controller('booking-details')
export class BookingDetailsController {
  constructor(private readonly bookingDetailsService: BookingDetailsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new booking detail' })
  @ApiResponse({ status: 201, description: 'The booking detail has been successfully created.', type: BookingDetail })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createBookingDetailDto: CreateBookingDetailDto): Promise<BookingDetail> {
    return this.bookingDetailsService.create(createBookingDetailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all booking details with pagination and sorting' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Return all booking details with pagination and sorting.', type: [BookingDetail] })
  findAll(@Query() getBookingDetailsDto: GetBookingDetailsDto): Promise<{ data: BookingDetail[]; total: number }> {
    return this.bookingDetailsService.findAll(getBookingDetailsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking detail by ID' })
  @ApiParam({ name: 'id', description: 'ID of the booking detail to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the booking detail.', type: BookingDetail })
  @ApiResponse({ status: 404, description: 'Booking detail not found.' })
  findOne(@Param('id') id: string): Promise<BookingDetail> {
    return this.bookingDetailsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a booking detail' })
  @ApiParam({ name: 'id', description: 'ID of the booking detail to update' })
  @ApiResponse({ status: 200, description: 'The booking detail has been successfully updated.', type: BookingDetail })
  @ApiResponse({ status: 404, description: 'Booking detail not found.' })
  update(@Param('id') id: string, @Body() updateBookingDetailDto: UpdateBookingDetailDto): Promise<BookingDetail> {
    return this.bookingDetailsService.update(id, updateBookingDetailDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking detail' })
  @ApiParam({ name: 'id', description: 'ID of the booking detail to delete' })
  @ApiResponse({ status: 204, description: 'The booking detail has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Booking detail not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.bookingDetailsService.remove(id);
  }
}
