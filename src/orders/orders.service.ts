import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Brackets, IsNull, Not, Between } from 'typeorm';
import { Order, OrderStatus, PaymentMethod } from './orders.entity';
import { OrderItem } from '../order-items/order-items.entity';
import { Product } from '../products/products.entity';
import { BookingDetail } from '../booking-details/booking-details.entity';
import { CreateOrderDto, UpdateOrderDto, GetOrderDto, OrderType } from './dtos';
import { CreateOrderItemDto } from '../order-items/dtos/create-order-item.dto';
import { OrderOverviewDto } from './dtos/order-overview.dto';

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
      let bookingDetail: BookingDetail | null = null;
      if (createOrderDto.bookingDetailId) {
        bookingDetail = await this.bookingDetailRepository.findOne({ where: { id: createOrderDto.bookingDetailId } });
        if (!bookingDetail) {
          throw new NotFoundException(`BookingDetail with ID "${createOrderDto.bookingDetailId}" not found`);
        }
      }

      const order = this.ordersRepository.create({
        bookingDetailId: createOrderDto.bookingDetailId || null,
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
            status: createOrderDto.status,
            paymentMethod: createOrderDto.paymentMethod,
            customerName: item.customerName,
            notes: item.notes,
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
    const {
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      bookingDetailId,
      courtId,
      positionId,
      paymentStatus,
      customerName,
      startDate,
      endDate,
      type = OrderType.ALL
    } = getOrderDto;

    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .leftJoinAndSelect('order.bookingDetail', 'bookingDetail')
      .leftJoinAndSelect('bookingDetail.court', 'court')
      .leftJoinAndSelect('bookingDetail.position', 'position')

    // Handle the new 'type' parameter
    if (type === OrderType.WALK_IN) {
      queryBuilder.andWhere('order.bookingDetailId IS NULL');
    } else if (type === OrderType.BOOKING) {
      queryBuilder.andWhere('order.bookingDetailId IS NOT NULL');
    }

    if (bookingDetailId) {
      queryBuilder.andWhere('order.bookingDetailId = :bookingDetailId', { bookingDetailId });
    }

    if (courtId) {
      queryBuilder.andWhere('court.id = :courtId', { courtId });
    }

    if (positionId) {
      queryBuilder.andWhere('position.id = :positionId', { positionId });
    }

    // if (ownerId) {
    //   queryBuilder.andWhere('bookingDetail.ownerId = :ownerId', { ownerId });
    // }

    if (paymentStatus) {
      queryBuilder.andWhere('order.status = :paymentStatus', { paymentStatus });
    }

    if (customerName) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where('orderItems.customerName LIKE :customerName', { customerName: `%${customerName}%` })
        })
      );
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    queryBuilder.orderBy(`order.${sortBy}`, sortOrder);

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    // Transform the data to include nested objects
    const transformedData = data.map(order => ({
      ...order,
      bookingDetail: order.bookingDetail ? {
        ...order.bookingDetail,
        court: order.bookingDetail.court,
        position: order.bookingDetail.position,
        owner: order.bookingDetail.owner
      } : null
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

  async confirmPayment(id: string, paymentMethod: PaymentMethod): Promise<Order> {
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

      // if (order.status === OrderStatus.PAID) {
      //   throw new BadRequestException(`Order with ID "${id}" is already paid`);
      // }

      // Update order status and payment method
      order.status = OrderStatus.PAID;
      order.paymentMethod = paymentMethod;
      await queryRunner.manager.save(order);

      // Update all associated order items status
      for (const orderItem of order.orderItems) {
        if (orderItem.status !== OrderStatus.PAID) {
          orderItem.status = OrderStatus.PAID;
          orderItem.paymentMethod = paymentMethod;
          await queryRunner.manager.save(orderItem);
        }
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

  async findByBookingDetailId(bookingDetailId: string): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      where: { bookingDetailId },
      relations: ['orderItems', 'orderItems.product', 'bookingDetail'],
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException(`No orders found for booking detail ID "${bookingDetailId}"`);
    }

    return orders;
  }

  async addOrderItems(orderId: string, createOrderItemDtos: CreateOrderItemDto[]): Promise<OrderItem[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.ordersRepository.findOne({ where: { id: orderId } });
      if (!order) {
        throw new NotFoundException(`Order with ID "${orderId}" not found`);
      }

      const newOrderItems = await Promise.all(createOrderItemDtos.map(async (dto) => {
        const product = await this.productRepository.findOne({ where: { id: dto.productId } });
        if (!product) {
          throw new NotFoundException(`Product with ID "${dto.productId}" not found`);
        }

        const orderItem = this.orderItemsRepository.create({
          ...dto,
          orderId,
          price: product.price * dto.quantity,
        });

        return queryRunner.manager.save(orderItem);
      }));

      // Update the total amount of the order
      const totalAmount = newOrderItems.reduce((sum, item) => sum + item.price, 0);
      order.totalAmount += totalAmount;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return newOrderItems;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOverview(filters: {
    startDate?: string;
    endDate?: string;
    customerName?: string;
    courtId?: string;
    positionId?: string;
    type?: OrderType;
  }): Promise<OrderOverviewDto> {
    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .leftJoin('order.bookingDetail', 'bookingDetail')
      .leftJoin('bookingDetail.court', 'court')
      .leftJoin('bookingDetail.position', 'position')
      .leftJoin('order.orderItems', 'orderItems');

    if (filters.startDate && filters.endDate) {
      queryBuilder.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    if (filters.customerName) {
      queryBuilder.andWhere('orderItems.customerName LIKE :customerName', {
        customerName: `%${filters.customerName}%`,
      });
    }

    if (filters.courtId) {
      queryBuilder.andWhere('court.id = :courtId', { courtId: filters.courtId });
    }

    if (filters.positionId) {
      queryBuilder.andWhere('position.id = :positionId', { positionId: filters.positionId });
    }

    if (filters.type) {
      if (filters.type === OrderType.WALK_IN) {
        queryBuilder.andWhere('order.bookingDetailId IS NULL');
      } else if (filters.type === OrderType.BOOKING) {
        queryBuilder.andWhere('order.bookingDetailId IS NOT NULL');
      }
    }

    const [
      { totalOrders, totalRevenue },
      { paidOrders, paidRevenue },
      { unpaidOrders, unpaidRevenue },
    ] = await Promise.all([
      queryBuilder.clone()
        .select('COUNT(DISTINCT order.id)', 'totalOrders')
        .addSelect('SUM(order.totalAmount)', 'totalRevenue')
        .getRawOne(),
      queryBuilder.clone()
        .andWhere('order.status = :status', { status: OrderStatus.PAID })
        .select('COUNT(DISTINCT order.id)', 'paidOrders')
        .addSelect('SUM(order.totalAmount)', 'paidRevenue')
        .getRawOne(),
      queryBuilder.clone()
        .andWhere('order.status = :status', { status: OrderStatus.UNPAID })
        .select('COUNT(DISTINCT order.id)', 'unpaidOrders')
        .addSelect('SUM(order.totalAmount)', 'unpaidRevenue')
        .getRawOne(),
    ]);

    return {
      totalOrders: Number(totalOrders) || 0,
      totalRevenue: Number(totalRevenue) || 0,
      paidOrders: Number(paidOrders) || 0,
      paidRevenue: Number(paidRevenue) || 0,
      unpaidOrders: Number(unpaidOrders) || 0,
      unpaidRevenue: Number(unpaidRevenue) || 0,
    };
  }
}
