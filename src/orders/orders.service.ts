import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './orders.entity';
import { OrderItem } from '../order-items/order-items.entity';
import { Product } from '../products/products.entity';
import { BookingDetail } from '../booking-details/booking-details.entity';
import { CreateOrderDto, UpdateOrderDto, GetOrderDto } from './dtos';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(BookingDetail)
    private bookingDetailRepository: Repository<BookingDetail>,
    private dataSource: DataSource,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const bookingDetail = await this.bookingDetailRepository.findOne({ where: { id: createOrderDto.bookingDetailId } });
      if (!bookingDetail) {
        throw new NotFoundException(`BookingDetail with ID "${createOrderDto.bookingDetailId}" not found`);
      }

      const order = this.ordersRepository.create({
        bookingDetailId: createOrderDto.bookingDetailId,
        status: createOrderDto.status,
        paymentMethod: createOrderDto.paymentMethod,
        orderCode: createOrderDto.orderCode,
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

  async findAll(getOrderDto: GetOrderDto): Promise<{ data: Order[]; total: number; page?: number; limit?: number }> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'DESC', bookingDetailId } = getOrderDto;

    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .leftJoinAndSelect('order.bookingDetail', 'bookingDetail')
      .leftJoinAndSelect('bookingDetail.court', 'court')
      .leftJoinAndSelect('bookingDetail.position', 'position')
      .leftJoinAndSelect('bookingDetail.booking', 'booking')
      .leftJoinAndSelect('booking.customer', 'customer');

    if (bookingDetailId) {
      queryBuilder.andWhere('order.bookingDetailId = :bookingDetailId', { bookingDetailId });
    }

    queryBuilder.orderBy(`order.${sortBy}`, sortOrder);

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    // Transform the data to include nested objects
    const transformedData = data.map(order => ({
      ...order,
      bookingDetail: {
        ...order.bookingDetail,
        court: order.bookingDetail.court,
        position: order.bookingDetail.position,
        owner: order.bookingDetail.owner
      }
    }));

    return { data: transformedData, total, page, limit };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['bookingDetail', 'orderItems', 'orderItems.product'],
    });
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.findOne(id);

      // Delete associated OrderItems
      await queryRunner.manager.delete(OrderItem, { orderId: id });

      // Delete the Order
      await queryRunner.manager.remove(order);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async confirmPayment(id: string): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.ordersRepository.findOne({
        where: { id },
        relations: ['orderItems'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }

      if (order.status === OrderStatus.PAID) {
        throw new BadRequestException(`Order with ID "${id}" is already paid`);
      }

      // Update order status
      order.status = OrderStatus.PAID;
      await queryRunner.manager.save(order);

      // Update all associated order items status
      for (const orderItem of order.orderItems) {
        orderItem.status = OrderStatus.PAID;
        await queryRunner.manager.save(orderItem);
      }

      await queryRunner.commitTransaction();

      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
