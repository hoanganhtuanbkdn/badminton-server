import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './orders.entity';
import { CreateOrderDto, UpdateOrderDto, GetOrderDto } from './dtos';
import { OrderItem } from 'src/order-items/order-items.entity';
import { Product } from 'src/products/products.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = this.ordersRepository.create({
        bookingId: createOrderDto.bookingId,
        status: createOrderDto.status,
        paymentMethod: createOrderDto.paymentMethod,
        totalAmount: createOrderDto.totalAmount,
      });
      const savedOrder = await queryRunner.manager.save(order);

      const orderItems = await Promise.all(
        createOrderDto.orderItems.map(async (item) => {
          const product = await this.productRepository.findOne({ where: { id: item.productId } });
          return this.orderItemsRepository.create({
            orderId: savedOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.quantity * product.price,
          });
        }),
      );
      await queryRunner.manager.save(OrderItem, orderItems as unknown as OrderItem[]);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(getOrdersDto: GetOrderDto): Promise<{ data: Order[]; total: number; page?: number; limit?: number }> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'DESC', bookingId } = getOrdersDto;

    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product');

    if (bookingId) {
      queryBuilder.andWhere('order.bookingId = :bookingId', { bookingId });
    }

    queryBuilder.orderBy(`order.${sortBy}`, sortOrder);

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.findOne(id);
      Object.assign(order, {
        status: updateOrderDto.status,
        paymentMethod: updateOrderDto.paymentMethod,
        totalAmount: updateOrderDto.totalAmount,
      });
      const updatedOrder = await queryRunner.manager.save(order);

      // Remove existing order items
      await queryRunner.manager.delete(OrderItem, { orderId: id });

      // Create new order items
      const orderItems = await Promise.all(
        updateOrderDto.orderItems.map(async (item) => {
          const product = await this.productRepository.findOne({ where: { id: item.productId } });
          return this.orderItemsRepository.create({
            orderId: updatedOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.quantity * product.price,
          });
        }),
      );
      await queryRunner.manager.save(OrderItem, orderItems as unknown as OrderItem[]);

      await queryRunner.commitTransaction();
      return updatedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }
}
