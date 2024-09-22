import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto, UpdateCourtDto, GetCourtsDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { Court } from './courts.entity';
import { SearchCourtsByLocationDto } from './dto/search-courts-by-location.dto';
@ApiTags('courts')
@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new court' })
  @ApiBody({ type: CreateCourtDto })
  @ApiResponse({ status: 201, description: 'Court created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createCourtDto: any) {
    return this.courtsService.create(createCourtDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courts with pagination and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Return all courts with pagination and sorting.', type: [Court] })
  findAll(@Query() getCourtsDto: GetCourtsDto): Promise<{ data: Court[]; total: number; page: number; limit: number }> {
    return this.courtsService.findAll(getCourtsDto);
  }

  @Get('search-by-location')
  @ApiOperation({ summary: 'Search courts by location with additional booking parameters' })
  @ApiQuery({ name: 'latitude', required: false, type: Number, description: 'Latitude of the client (e.g., 16.067528)' })
  @ApiQuery({ name: 'longitude', required: false, type: Number, description: 'Longitude of the client (e.g., 108.207244)' })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Search radius in meters (e.g., 500)' })
  @ApiQuery({ name: 'bookingDate', required: false, type: Date, description: 'Date for booking (e.g., 2023-06-01)' })
  @ApiQuery({ name: 'startTime', required: false, type: String, description: 'Start time for booking (HH:mm) (e.g., 14:00)' })
  @ApiQuery({ name: 'duration', required: false, type: Number, description: 'Duration of booking in minutes (e.g., 60)' })
  @ApiQuery({ name: 'numberOfCourts', required: false, type: Number, description: 'Number of courts to book (e.g., 1)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (e.g., 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page (e.g., 10)' })
  @ApiResponse({
    status: 200,
    description: 'Returns courts matching the search criteria',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            allOf: [
              { $ref: getSchemaPath(Court) },
              {
                type: 'object',
                properties: {
                  availablePositionsCount: { type: 'number', description: 'Number of available positions' },
                  distanceInMeters: { type: 'number', description: 'Distance to the court in meters' },
                  formattedDistance: { type: 'string', description: 'Formatted distance to the court' },
                },
              },
            ],
          },
        },
        total: { type: 'number', description: 'Total number of courts matching the criteria' },
        page: { type: 'number', description: 'Current page number' },
        limit: { type: 'number', description: 'Number of items per page' },
      },
    },
  })
  searchByLocation(@Query() searchDto: any) {
    return this.courtsService.searchByLocation(searchDto);
  }

  @Get('/by-owner/:ownerId')
  @ApiOperation({ summary: 'Get courts by ownerId' })
  @ApiParam({ name: 'ownerId', description: 'ID of the owner to retrieve courts for' })
  @ApiResponse({ status: 200, description: 'Return courts for the specified owner.', type: [Court] })
  @ApiResponse({ status: 404, description: 'Owner not found.' })
  findByOwnerId(@Param('ownerId') ownerId: string) {
    return this.courtsService.findByOwnerId(ownerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a court by ID' })
  @ApiParam({ name: 'id', description: 'Court ID' })
  @ApiQuery({ name: 'latitude', required: false, type: Number, description: 'Latitude of the client' })
  @ApiQuery({ name: 'longitude', required: false, type: Number, description: 'Longitude of the client' })
  @ApiResponse({
    status: 200,
    description: 'Returns the court with the specified ID',
    schema: {
      allOf: [
        { $ref: getSchemaPath(Court) },
        {
          type: 'object',
          properties: {
            distance: { type: 'number', description: 'Distance to the court in meters', nullable: true },
            distanceWithUnit: { type: 'string', description: 'Distance to the court with unit', nullable: true },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: 'Court not found' })
  findOne(@Param('id') id: string, @Query('latitude') latitude?: number, @Query('longitude') longitude?: number) {
    return this.courtsService.findOne(id, latitude, longitude);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a court by ID' })
  @ApiParam({ name: 'id', description: 'Court ID' })
  @ApiBody({ type: UpdateCourtDto })
  @ApiResponse({ status: 200, description: 'Court updated successfully' })
  @ApiResponse({ status: 404, description: 'Court not found' })
  update(@Param('id') id: string, @Body() updateCourtDto: any) {
    return this.courtsService.update(id, updateCourtDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a court by ID' })
  @ApiParam({ name: 'id', description: 'Court ID' })
  @ApiResponse({ status: 200, description: 'Court deleted successfully' })
  @ApiResponse({ status: 404, description: 'Court not found' })
  remove(@Param('id') id: string) {
    return this.courtsService.remove(id);
  }
}
