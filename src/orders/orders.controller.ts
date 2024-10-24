import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto, GetOrderDto, OrderOverviewDto } from './dtos';
import { Order } from './orders.entity';
import { CreateOrderItemDto } from '../order-items/dtos/create-order-item.dto';
import { OrderItem } from '../order-items/order-items.entity';
import { PaymentMethod } from './orders.entity';
import { OrderType } from './dtos/get-order.dto';

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
  @ApiQuery({ name: 'courtId', required: false, description: 'Filter by court ID' })
  @ApiQuery({ name: 'positionId', required: false, description: 'Filter by position ID' })
  @ApiQuery({ name: 'paymentStatus', required: false, description: 'Filter by payment status (e.g., PAID, UNPAID)' })
  @ApiQuery({ name: 'customerName', required: false, description: 'Search by customer name' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filtering by bookingDate' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for filtering by bookingDate' })
  @ApiQuery({ name: 'type', required: false, enum: OrderType, description: 'Filter by order type (ALL, WALK_IN, BOOKING)' })
  @ApiResponse({ status: 200, description: 'Return all orders with pagination, sorting, and filtering.', type: [Order] })
  findAll(@Query() getOrdersDto: GetOrderDto): Promise<{ data: Order[]; total: number; page?: number; limit?: number }> {
    return this.ordersService.findAll(getOrdersDto);
  }

  @Get(':id/detail')
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paymentMethod: {
          type: 'string',
          enum: ['CASH', 'TRANSFER'],
          description: 'The payment method used'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The order payment has been successfully confirmed.', type: Order })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  confirmPayment(
    @Param('id') id: string,
    @Body('paymentMethod') paymentMethod: PaymentMethod
  ): Promise<Order> {
    return this.ordersService.confirmPayment(id, paymentMethod);
  }

  @Get('by-booking-detail/:bookingDetailId')
  @ApiOperation({ summary: 'Get orders by booking detail ID' })
  @ApiParam({ name: 'bookingDetailId', description: 'ID of the booking detail' })
  @ApiResponse({ status: 200, description: 'Return the orders for the given booking detail ID.', type: [Order] })
  @ApiResponse({ status: 404, description: 'No orders found for the given booking detail ID.' })
  findByBookingDetailId(@Param('bookingDetailId') bookingDetailId: string): Promise<Order[]> {
    return this.ordersService.findByBookingDetailId(bookingDetailId);
  }

  @Post(':orderId/add-products')
  @ApiOperation({ summary: 'Add order items to an existing order' })
  @ApiParam({ name: 'orderId', description: 'ID of the order to add items to' })
  @ApiBody({ type: [CreateOrderItemDto] })
  @ApiResponse({ status: 201, description: 'The order items have been successfully added.', type: [OrderItem] })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  addOrderItems(@Param('orderId') orderId: string, @Body() createOrderItemDtos: CreateOrderItemDto[]): Promise<OrderItem[]> {
    return this.ordersService.addOrderItems(orderId, createOrderItemDtos);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get orders overview' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date for filtering, ex: 2024-01-01' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date for filtering, ex: 2024-01-01' })
  @ApiQuery({ name: 'customerName', required: false, type: String, description: 'Customer name for filtering' })
  @ApiQuery({ name: 'courtId', required: false, type: String, description: 'Court ID for filtering' })
  @ApiQuery({ name: 'positionId', required: false, type: String, description: 'Position ID for filtering' })
  @ApiQuery({ name: 'type', required: false, enum: OrderType, description: 'Order type for filtering' })
  @ApiResponse({ status: 200, description: 'Return the orders overview.', type: OrderOverviewDto })
  getOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('customerName') customerName?: string,
    @Query('courtId') courtId?: string,
    @Query('positionId') positionId?: string,
    @Query('type') type?: OrderType
  ): Promise<OrderOverviewDto> {
    return this.ordersService.getOverview({
      startDate,
      endDate,
      customerName,
      courtId,
      positionId,
      type,
    });
  }
}
