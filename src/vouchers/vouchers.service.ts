import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from './vouchers.entity';
import { CreateVoucherDto, UpdateVoucherDto } from './dto';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private vouchersRepository: Repository<Voucher>,
  ) { }

  create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    const voucher = this.vouchersRepository.create(createVoucherDto);
    return this.vouchersRepository.save(voucher);
  }

  findAll(): Promise<Voucher[]> {
    return this.vouchersRepository.find();
  }

  findOne(id: string): Promise<Voucher> {
    return this.vouchersRepository.findOne({ where: { id } });
  }

  async update(id: string, updateVoucherDto: UpdateVoucherDto): Promise<Voucher> {
    await this.vouchersRepository.update(id, updateVoucherDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.vouchersRepository.delete(id);
  }
}
