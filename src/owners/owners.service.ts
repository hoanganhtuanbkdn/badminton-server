import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './owners.entity';
import { UpdateOwnerDto, CreateOwnerDto, GetOwnersDto } from './dto';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner)
    private ownersRepository: Repository<Owner>,
  ) { }

  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const owner = this.ownersRepository.create(createOwnerDto);
    return this.ownersRepository.save(owner);
  }

  async findAll(getOwnersDto: GetOwnersDto): Promise<{ data: Owner[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'DESC', name, email } = getOwnersDto;

    const queryBuilder = this.ownersRepository.createQueryBuilder('owner');

    if (name) {
      queryBuilder.andWhere('owner.name LIKE :name', { name: `%${name}%` });
    }

    if (email) {
      queryBuilder.andWhere('owner.email LIKE :email', { email: `%${email}%` });
    }

    queryBuilder
      .orderBy(`owner.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Owner> {
    const owner = await this.ownersRepository.findOne({ where: { id } });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
    return owner;
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto): Promise<Owner> {
    await this.ownersRepository.update(id, updateOwnerDto);
    const updatedOwner = await this.ownersRepository.findOne({ where: { id } });
    if (!updatedOwner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
    return updatedOwner;
  }

  async remove(id: string): Promise<void> {
    const result = await this.ownersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
  }
}
