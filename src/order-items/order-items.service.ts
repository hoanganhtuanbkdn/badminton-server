import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './order-items.entity';
import { CreateOrderItemDto, UpdateOrderItemDto, GetOrderItemsDto } from './dtos';
import { Order } from '../orders/orders.entity';
import { Product } from '../products/products.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async findAllByOrderId(orderId: string, getOrderItemsDto: GetOrderItemsDto): Promise<{ data: OrderItem[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = getOrderItemsDto;

    const queryBuilder = this.orderItemsRepository.createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .where('orderItem.orderId = :orderId', { orderId })
      .orderBy(`orderItem.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const order = await this.ordersRepository.findOne({ where: { id: createOrderItemDto.orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID "${createOrderItemDto.orderId}" not found`);
    }

    const product = await this.productsRepository.findOne({ where: { id: createOrderItemDto.productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID "${createOrderItemDto.productId}" not found`);
    }

    const orderItem = this.orderItemsRepository.create({
      ...createOrderItemDto,
      price: product.price * createOrderItemDto.quantity,
    });

    return this.orderItemsRepository.save(orderItem) as unknown as Promise<OrderItem>;
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    const orderItem = await this.orderItemsRepository.findOne({ where: { id } });


    if (!orderItem) {
      throw new NotFoundException(`Order item with ID "${id}" not found`);
    }

    const _updateOrderItemDto = {
      ...updateOrderItemDto,
      price: 0,
    }

    if
      (_updateOrderItemDto.productId) {
      const product = await this.productsRepository.findOne({ where: { id: updateOrderItemDto.productId } });
      if (!product) {
        throw new NotFoundException(`Product with ID "${updateOrderItemDto.productId}" not found`);
      }
      _updateOrderItemDto.price = product.price * (updateOrderItemDto.quantity || orderItem.quantity);
    }

    Object.assign(orderItem, updateOrderItemDto);
    return this.orderItemsRepository.save(orderItem);
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderItemsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order item with ID "${id}" not found`);
    }
  }
}
