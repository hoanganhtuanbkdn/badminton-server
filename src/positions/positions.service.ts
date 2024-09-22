import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './positions.entity';
import { CreatePositionDto, UpdatePositionDto, GetPositionsDto } from './dto';
import { Court } from 'src/courts/courts.entity';
import { BookingDetail } from 'src/booking-details/booking-details.entity';

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

  async findAvailablePositions(courtId: string, startTime: string, duration: number, bookingDate: Date): Promise<Position[]> {
    try {
      const endTime = new Date(`${bookingDate.toISOString().split('T')[0]}T${startTime}`);
      endTime.setMinutes(endTime.getMinutes() + Number(duration));

      console.log(startTime, duration, bookingDate);
      const positions = await this.positionsRepository.createQueryBuilder('position')
        .leftJoinAndSelect('position.bookingDetails', 'bookingDetail')
        .where('position.courtId = :courtId', { courtId })
        .andWhere(qb => {
          const subQuery = qb.subQuery()
            .select('1')
            .from(BookingDetail, 'bd')
            .where('bd.positionId = position.id')
            .andWhere('bd.bookingDate = :bookingDate', { bookingDate })
            .andWhere('(bd.startTime < :endTime AND bd.endTime > :startTime)', { startTime, endTime: endTime.toTimeString().slice(0, 5) })
            .getQuery();
          return 'NOT EXISTS (' + subQuery + ')';
        })
        .getMany();

      console.log(positions);
      return positions;
    } catch (error) {
      console.error('Error in findAvailablePositions:', error);
      return [];
    }
  }
}
