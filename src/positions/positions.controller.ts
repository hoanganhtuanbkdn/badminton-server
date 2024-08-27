import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto, UpdatePositionDto, GetPositionsDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { Position } from './positions.entity';

@ApiTags('positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new position' })
  @ApiBody({ type: CreatePositionDto })
  @ApiResponse({ status: 201, description: 'The position has been successfully created.', type: Position })
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all positions with pagination and sorting' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Return all positions with pagination and sorting.', type: [Position] })
  findAll(@Query() getPositionsDto: GetPositionsDto) {
    return this.positionsService.findAll(getPositionsDto);
  }

  @Get('/by-court/:courtId')
  @ApiOperation({ summary: 'Get positions by courtId' })
  @ApiParam({ name: 'courtId', description: 'ID of the court to retrieve positions for' })
  @ApiResponse({ status: 200, description: 'Return positions for the specified court.', type: [Position] })
  @ApiResponse({ status: 404, description: 'Court not found.' })
  findByCourtId(@Param('courtId') courtId: string) {
    return this.positionsService.findByCourtId(courtId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a position by ID' })
  @ApiParam({ name: 'id', description: 'ID of the position to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the position.', type: Position })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a position' })
  @ApiParam({ name: 'id', description: 'ID of the position to update' })
  @ApiBody({ type: UpdatePositionDto })
  @ApiResponse({ status: 200, description: 'The position has been successfully updated.', type: Position })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
    return this.positionsService.update(id, updatePositionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a position' })
  @ApiParam({ name: 'id', description: 'ID of the position to delete' })
  @ApiResponse({ status: 204, description: 'The position has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  remove(@Param('id') id: string) {
    return this.positionsService.remove(id);
  }
}
