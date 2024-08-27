import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from './courts.entity';
import { CreateCourtDto, UpdateCourtDto } from './dto';
import { GetCourtsDto } from './dto/get-courts.dto';
import { Owner } from 'src/owners/owners.entity';

@Injectable()
export class CourtsService {
  constructor(
    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,
    @InjectRepository(Owner)
    private ownersRepository: Repository<Owner>,
  ) { }

  async create(createCourtDto: CreateCourtDto): Promise<Court> {
    const { ownerId, ...courtData } = createCourtDto;

    const owner = await this.ownersRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new Error(`Owner with ID ${ownerId} not found`);
    }

    const court = this.courtsRepository.create({
      ...courtData,
      owner, // liên kết với Owner đã tìm thấy
    });

    return this.courtsRepository.save(court);
  }

  async findAll(getCourtsDto: GetCourtsDto): Promise<{ data: Court[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = getCourtsDto;

    const [data, total] = await this.courtsRepository.findAndCount({
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      // relations: ['owner'],  
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
