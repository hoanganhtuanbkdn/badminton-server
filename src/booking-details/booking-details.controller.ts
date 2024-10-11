import { Controller, Get, Post, Body, Param, Delete, Put, Query, Patch } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { CreateBookingDetailDto, UpdateBookingDetailDto, GetBookingDetailsDto, SortByFields, SortOrder } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { BookingDetail } from './booking-details.entity';
import { GetDashboardOverviewDto, OverviewPeriod } from './dto/get-dashboard-overview.dto';

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
  @ApiOperation({ summary: 'Get all booking details with pagination, sorting, and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page for pagination' })
  @ApiQuery({ name: 'sortBy', required: false, enum: SortByFields, description: 'Field to sort by (createdAt or bookingDate)' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder, description: 'Sort order (ASC or DESC)' })
  @ApiQuery({ name: 'courtId', required: false, description: 'Filter by court ID' })
  @ApiQuery({ name: 'positionId', required: false, description: 'Filter by position ID' })
  @ApiQuery({ name: 'ownerId', required: false, description: 'Filter by owner ID' })
  @ApiQuery({ name: 'paymentStatus', required: false, description: 'Filter by payment status (e.g., PAID, UNPAID)' })
  @ApiQuery({ name: 'customerName', required: false, description: 'Search by customer name' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filtering by bookingDate' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for filtering by bookingDate' })
  @ApiResponse({ status: 200, description: 'Return all booking details with pagination, sorting, and filtering.', type: [BookingDetail] })
  findAll(@Query() getBookingDetailsDto: GetBookingDetailsDto): Promise<{ data: BookingDetail[]; total: number, page: number, limit?: number }> {
    return this.bookingDetailsService.findAll(getBookingDetailsDto);
  }

  @Get('/overview')
  @ApiOperation({ summary: 'Get dashboard overview for bookings' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard overview retrieved successfully.',
  })
  @ApiQuery({ name: 'period', enum: OverviewPeriod, description: 'Display period: today, this week, this month, this quarter, or custom' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (used when period is CUSTOM)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (used when period is CUSTOM)' })
  getBookingsOverview(@Query() getDashboardOverviewDto: GetDashboardOverviewDto) {
    return this.bookingDetailsService.getOverview(getDashboardOverviewDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking detail by ID' })
  @ApiParam({ name: 'id', description: 'ID of the booking detail to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the booking detail.', type: BookingDetail })
  @ApiResponse({ status: 404, description: 'Booking detail not found.' })
  findOne(@Param('id') id: string): Promise<BookingDetail> {
    return this.bookingDetailsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking detail' })
  @ApiParam({ name: 'id', description: 'ID of the booking detail to update' })
  @ApiResponse({ status: 200, description: 'The booking detail has been successfully updated.', type: BookingDetail })
  @ApiResponse({ status: 404, description: 'Booking detail not found.' })
  @ApiBody({ type: UpdateBookingDetailDto })
  update(@Param('id') id: string, @Body() updateBookingDetailDto: any): Promise<BookingDetail> {
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
