import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto, UpdateOwnerDto, GetOwnersDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { Owner } from './owners.entity';

@ApiTags('owners')
@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new owner' })
  @ApiBody({ type: CreateOwnerDto })
  @ApiResponse({ status: 201, description: 'The owner has been successfully created.', type: Owner })
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.create(createOwnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all owners with pagination and sorting' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order', example: 'DESC' })
  @ApiResponse({ status: 200, description: 'Return all owners with pagination and sorting.', type: [Owner] })
  findAll(@Query() getOwnersDto: GetOwnersDto) {
    return this.ownersService.findAll(getOwnersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an owner by ID' })
  @ApiParam({ name: 'id', description: 'ID of the owner to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the owner.', type: Owner })
  @ApiResponse({ status: 404, description: 'Owner not found.' })
  findOne(@Param('id') id: string) {
    return this.ownersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an owner' })
  @ApiParam({ name: 'id', description: 'ID of the owner to update' })
  @ApiBody({ type: UpdateOwnerDto })
  @ApiResponse({ status: 200, description: 'The owner has been successfully updated.', type: Owner })
  @ApiResponse({ status: 404, description: 'Owner not found.' })
  update(@Param('id') id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.ownersService.update(id, updateOwnerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an owner' })
  @ApiParam({ name: 'id', description: 'ID of the owner to delete' })
  @ApiResponse({ status: 204, description: 'The owner has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Owner not found.' })
  remove(@Param('id') id: string) {
    return this.ownersService.remove(id);
  }
}
