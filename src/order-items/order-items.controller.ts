import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto, UpdateOrderItemDto, GetOrderItemsDto } from './dtos';
import { OrderItem } from './order-items.entity';

@ApiTags('order-items')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) { }

  @Get('by-order/:orderId')
  @ApiOperation({ summary: 'Get all order items for a specific order with pagination and sorting' })
  @ApiParam({ name: 'orderId', description: 'ID of the order' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Return all order items for the specified order with pagination and sorting.', type: [OrderItem] })
  findAllByOrderId(
    @Param('orderId') orderId: string,
    @Query() getOrderItemsDto: GetOrderItemsDto
  ): Promise<{ data: OrderItem[]; total: number; page: number; limit: number }> {
    return this.orderItemsService.findAllByOrderId(orderId, getOrderItemsDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiBody({ type: CreateOrderItemDto })
  @ApiResponse({ status: 201, description: 'The order item has been successfully created.', type: OrderItem })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order item' })
  @ApiParam({ name: 'id', description: 'ID of the order item to update' })
  @ApiBody({ type: UpdateOrderItemDto })
  @ApiResponse({ status: 200, description: 'The order item has been successfully updated.', type: OrderItem })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  update(@Param('id') id: string, @Body() updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order item' })
  @ApiParam({ name: 'id', description: 'ID of the order item to delete' })
  @ApiResponse({ status: 204, description: 'The order item has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.orderItemsService.remove(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the order item to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the order item.', type: OrderItem })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  findOne(@Param('id') id: string): Promise<OrderItem> {
    return this.orderItemsService.findOne(id);
  }
}
