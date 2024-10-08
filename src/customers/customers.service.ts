import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customers.entity';
import { GetCustomersDto, CreateCustomerDto, UpdateCustomerDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { Booking } from 'src/bookings/bookings.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepository.create(createCustomerDto);
    return this.customersRepository.save(customer);
  }

  async findAll(getCustomersDto: GetCustomersDto): Promise<{ data: Customer[]; total: number; page?: number; limit?: number }> {
    const { page, limit, sortBy, sortOrder } = getCustomersDto;

    const queryOptions: any = {};

    if (page && limit) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
    }

    if (sortBy && sortOrder) {
      queryOptions.order = { [sortBy]: sortOrder };
    }

    const [data, total] = await this.customersRepository.findAndCount(queryOptions);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Customer> {
    return this.customersRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    await this.customersRepository.update(id, updateCustomerDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.customersRepository.delete(id);
  }

  async findCustomerBookings(customerId: string): Promise<Booking[]> {
    const customer = await this.customersRepository.findOne({
      where: { id: customerId },
      relations: ['bookings'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${customerId}" not found`);
    }

    return customer.bookings;
  }
}
