import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './owners.entity';
import { UpdateOwnerDto, CreateOwnerDto } from './dto';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner)
    private ownersRepository: Repository<Owner>,
  ) { }

  async create(ownerDto: CreateOwnerDto): Promise<Owner> {
    const owner = this.ownersRepository.create(ownerDto);
    return this.ownersRepository.save(owner);
  }

  async findAll(): Promise<Owner[]> {
    return this.ownersRepository.find();
  }

  async findOne(id: string): Promise<Owner> {
    return this.ownersRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto): Promise<Owner> {
    await this.ownersRepository.update(id, updateOwnerDto);
    return this.ownersRepository.findOne({ where: { id: id } });
  }

  async remove(id: string): Promise<void> {
    await this.ownersRepository.delete(id);
  }
}
