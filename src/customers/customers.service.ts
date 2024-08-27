import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customers.entity';
import { GetCustomersDto, CreateCustomerDto, UpdateCustomerDto } from './dto';

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

  async findAll(getCustomersDto: GetCustomersDto): Promise<{ data: Customer[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = getCustomersDto;

    const [data, total] = await this.customersRepository.findAndCount({
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

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
}
