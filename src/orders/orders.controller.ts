import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto, GetOrderDto } from './dtos';
import { Order } from './orders.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'The order has been successfully created.', type: Order })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with pagination, sorting, and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiQuery({ name: 'bookingDetailId', required: false, description: 'Filter by booking detail ID' })
  @ApiResponse({ status: 200, description: 'Return all orders with pagination, sorting, and filtering.', type: [Order] })
  findAll(@Query() getOrdersDto: GetOrderDto): Promise<{ data: Order[]; total: number; page?: number; limit?: number }> {
    return this.ordersService.findAll(getOrdersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'ID of the order to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the order.', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', description: 'ID of the order to update' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'The order has been successfully updated.', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', description: 'ID of the order to delete' })
  @ApiResponse({ status: 204, description: 'The order has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.ordersService.remove(id);
  }

  @Post(':id/confirm-payment')
  @ApiOperation({ summary: 'Confirm payment for an order' })
  @ApiParam({ name: 'id', description: 'ID of the order to confirm payment' })
  @ApiResponse({ status: 200, description: 'The order payment has been successfully confirmed.', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  confirmPayment(@Param('id') id: string): Promise<Order> {
    return this.ordersService.confirmPayment(id);
  }
}
