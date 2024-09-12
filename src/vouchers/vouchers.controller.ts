import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto, UpdateVoucherDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('vouchers')
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) { }

  @ApiOperation({ summary: 'Create a new voucher' })
  @ApiResponse({ status: 201, description: 'Voucher created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({ type: CreateVoucherDto })
  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @ApiOperation({ summary: 'Get all vouchers with pagination and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'DESC', description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'List of vouchers returned.' })
  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.vouchersService.findAll({ page, limit, sortBy, sortOrder });
  }

  @ApiOperation({ summary: 'Check voucher by code' })
  @ApiParam({ name: 'code', description: 'Voucher code to check', example: 'SUMMER2024' })
  @ApiResponse({ status: 200, description: 'Voucher found.' })
  @ApiResponse({ status: 404, description: 'Voucher not found.' })
  @Get('check/:code')
  checkVoucher(@Param('code') code: string) {
    return this.vouchersService.checkVoucher(code);
  }

  @ApiOperation({ summary: 'Get a voucher by ID' })
  @ApiParam({ name: 'id', description: 'Unique ID of the voucher', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiResponse({ status: 200, description: 'Voucher details returned.' })
  @ApiResponse({ status: 404, description: 'Voucher not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vouchersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a voucher by ID' })
  @ApiParam({ name: 'id', description: 'Unique ID of the voucher to update', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiBody({ type: UpdateVoucherDto })
  @ApiResponse({ status: 200, description: 'Voucher updated successfully.' })
  @ApiResponse({ status: 404, description: 'Voucher not found.' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.vouchersService.update(id, updateVoucherDto);
  }

  @ApiOperation({ summary: 'Delete a voucher by ID' })
  @ApiParam({ name: 'id', description: 'Unique ID of the voucher to delete', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @ApiResponse({ status: 200, description: 'Voucher deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Voucher not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vouchersService.remove(id);
  }
}
