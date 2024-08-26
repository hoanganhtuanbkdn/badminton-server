import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from './courts.entity';
import { CreateCourtDto, UpdateCourtDto } from './dto';
import { GetCourtsDto } from './dto/get-courts.dto';

@Injectable()
export class CourtsService {
  constructor(
    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,
  ) { }

  create(createCourtDto: CreateCourtDto): Promise<Court> {
    const court = this.courtsRepository.create(createCourtDto);
    return this.courtsRepository.save(court);
  }

  async findAll(getCourtsDto: GetCourtsDto): Promise<{ data: Court[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = getCourtsDto;

    const [data, total] = await this.courtsRepository.findAndCount({
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      // relations: ['owner'],  // Quan hệ với bảng khác, nếu cần
    });

    return { data, total, page, limit };
  }

  findOne(id: string): Promise<Court> {
    return this.courtsRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateCourtDto: UpdateCourtDto): Promise<Court> {
    await this.courtsRepository.update(id, updateCourtDto);
    return this.courtsRepository.findOne({ where: { id: id } });
  }

  async remove(id: string): Promise<void> {
    await this.courtsRepository.delete(id);
  }
}
