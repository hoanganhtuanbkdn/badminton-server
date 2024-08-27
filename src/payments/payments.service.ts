import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payments.entity';
import { GetPaymentsDto } from './dto/get-payments.dto';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) { }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(createPaymentDto);
    return this.paymentsRepository.save(payment);
  }

  async findAll(getPaymentsDto: GetPaymentsDto): Promise<{ data: Payment[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = getPaymentsDto;

    const [data, total] = await this.paymentsRepository.findAndCount({
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Payment> {
    return this.paymentsRepository.findOne({ where: { id } });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    await this.paymentsRepository.update(id, updatePaymentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
  }
}
