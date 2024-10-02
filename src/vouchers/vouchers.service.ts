import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  create(createVoucherDto: any) {
    const voucher = this.vouchersRepository.create(createVoucherDto);
    return this.vouchersRepository.save(voucher);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ data: Voucher[]; total: number }> {
    console.log('query', query);

    const { page, limit, sortBy = 'createdAt', sortOrder = 'DESC', } = query;
    console.log('page', page, limit);
    const where: any = {};
    let data: Voucher[];
    let total: number;

    if (page && limit) {
      [data, total] = await this.vouchersRepository.findAndCount({
        where,
        order: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });
    } else {
      data = await this.vouchersRepository.find({
        where,
        order: { [sortBy]: sortOrder },
      });
      total = data.length;
    }
    return { data, total };
  }

  findOne(id: string): Promise<Voucher> {
    return this.vouchersRepository.findOne({ where: { id } });
  }

  async checkVoucher(code: string): Promise<Voucher | null> {
    const voucher = await this.vouchersRepository.findOne({ where: { code } });

    if (!voucher) {
      throw new NotFoundException('Voucher not found.');
    }

    const currentDate = new Date();

    // Check validFrom (voucher is not valid if currentDate is before validFrom)
    if (voucher.validFrom && currentDate < voucher.validFrom) {
      throw new BadRequestException('Voucher is not valid yet.');
    }

    // Check validUntil (voucher is expired if currentDate is after validUntil)
    if (voucher.validUntil && currentDate > voucher.validUntil) {
      throw new BadRequestException('Voucher has expired.');
    }

    // Check availableUsage (voucher is not usable if availableUsage is less than or equal to 0)
    if (voucher.availableUsage <= 0) {
      throw new BadRequestException('Voucher has no available uses left.');
    }

    return voucher;
  }

  async update(id: string, updateVoucherDto: UpdateVoucherDto): Promise<Voucher> {
    console.log('updateVoucherDto', id, updateVoucherDto);
    await this.vouchersRepository.update(id, updateVoucherDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.vouchersRepository.delete(id);
  }
}
