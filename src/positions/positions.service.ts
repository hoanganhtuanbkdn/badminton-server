import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './positions.entity';
import { CreatePositionDto, UpdatePositionDto, GetPositionsDto } from './dto';
import { Court } from 'src/courts/courts.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,

    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,

  ) { }


  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const { courtId, ...positionData } = createPositionDto;

    const court = await this.courtsRepository.findOne({ where: { id: courtId } });
    if (!court) {
      throw new NotFoundException(`Court with ID ${courtId} not found`);
    }

    const position = this.positionsRepository.create({
      ...positionData,
      court,
    });

    return this.positionsRepository.save(position);
  }

  async findAll(getPositionsDto: GetPositionsDto): Promise<{ data: Position[]; total: number }> {
    const { page, limit, sortBy, sortOrder } = getPositionsDto;

    const queryBuilder = this.positionsRepository.createQueryBuilder('position');

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`position.${sortBy}`, sortOrder);
    }

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findByCourtId(courtId: string): Promise<Position[]> {
    const court = await this.courtsRepository.findOne({ where: { id: courtId } });
    if (!court) {
      throw new NotFoundException(`Court with ID ${courtId} not found`);
    }
    return this.positionsRepository.find({ where: { courtId } });
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.positionsRepository.findOne({ where: { id } });
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return position;
  }

  async update(id: string, updatePositionDto: UpdatePositionDto): Promise<Position> {
    await this.positionsRepository.update(id, updatePositionDto);
    const updatedPosition = await this.positionsRepository.findOne({ where: { id } });
    if (!updatedPosition) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return updatedPosition;
  }

  async remove(id: string): Promise<void> {
    const result = await this.positionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
  }
}
