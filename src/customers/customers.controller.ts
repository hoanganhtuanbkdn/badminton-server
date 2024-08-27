import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto, GetCustomersDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { Customer } from './customers.entity';

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
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order', example: 'DESC' })
  @ApiResponse({ status: 200, description: 'Return all customers with pagination and sorting.', type: [Customer] })
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
}
