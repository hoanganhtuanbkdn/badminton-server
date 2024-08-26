import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from './courts.entity';
import { CreateCourtDto, UpdateCourtDto } from './dto';

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

  findAll(): Promise<Court[]> {
    return this.courtsRepository.find();
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
