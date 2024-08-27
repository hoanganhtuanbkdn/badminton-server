import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto, GetPaymentsDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { Payment } from './payments.entity';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'The payment has been successfully created.', type: Payment })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments with pagination and sorting' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Return all payments with pagination and sorting.', type: [Payment] })
  findAll(@Query() getPaymentsDto: GetPaymentsDto): Promise<{ data: Payment[]; total: number }> {
    return this.paymentsService.findAll(getPaymentsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiParam({ name: 'id', description: 'ID of the payment to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the payment.', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a payment' })
  @ApiParam({ name: 'id', description: 'ID of the payment to update' })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({ status: 200, description: 'The payment has been successfully updated.', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment' })
  @ApiParam({ name: 'id', description: 'ID of the payment to delete' })
  @ApiResponse({ status: 204, description: 'The payment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.paymentsService.remove(id);
  }
}
