import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto, UpdateCourtDto, GetCourtsDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Court } from './courts.entity';
@ApiTags('courts')
@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new court' })
  @ApiBody({ type: CreateCourtDto })
  @ApiResponse({ status: 201, description: 'Court created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createCourtDto: CreateCourtDto) {
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
  @ApiResponse({ status: 200, description: 'Court found' })
  @ApiResponse({ status: 404, description: 'Court not found' })
  findOne(@Param('id') id: string) {
    return this.courtsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a court by ID' })
  @ApiParam({ name: 'id', description: 'Court ID' })
  @ApiBody({ type: UpdateCourtDto })
  @ApiResponse({ status: 200, description: 'Court updated successfully' })
  @ApiResponse({ status: 404, description: 'Court not found' })
  update(@Param('id') id: string, @Body() updateCourtDto: UpdateCourtDto) {
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
