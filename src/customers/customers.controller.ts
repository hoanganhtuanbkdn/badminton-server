import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto, GetCustomersDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, getSchemaPath } from '@nestjs/swagger';
import { Customer } from './customers.entity';
import { Booking } from 'src/bookings/bookings.entity';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({ status: 201, description: 'The customer has been successfully created.', type: Customer })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination and sorting' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiResponse({
    status: 200,
    description: 'Return all customers with pagination and sorting.',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: getSchemaPath(Customer) } },
        total: { type: 'number' },
        page: { type: 'number', nullable: true },
        limit: { type: 'number', nullable: true },
      },
    },
  })
  findAll(@Query() getCustomersDto: GetCustomersDto) {
    return this.customersService.findAll(getCustomersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', description: 'ID of the customer to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the customer.', type: Customer })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'ID of the customer to update' })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({ status: 200, description: 'The customer has been successfully updated.', type: Customer })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', description: 'ID of the customer to delete' })
  @ApiResponse({ status: 204, description: 'The customer has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @Get(':id/bookings')
  @ApiOperation({ summary: 'Get all bookings for a customer' })
  @ApiParam({ name: 'id', description: 'ID of the customer' })
  @ApiResponse({ status: 200, description: 'Return all bookings for the customer.', type: [Booking] })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  findCustomerBookings(@Param('id') id: string) {
    return this.customersService.findCustomerBookings(id);
  }
}
