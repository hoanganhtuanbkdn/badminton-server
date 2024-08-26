import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePositionDto, UpdatePositionDto } from "./dto";
import { Position } from "./positions.entity";

export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
  ) { }

  create(createPositionDto: CreatePositionDto): Promise<Position> {
    const position = this.positionsRepository.create(createPositionDto);
    return this.positionsRepository.save(position);
  }

  findAll(): Promise<Position[]> {
    return this.positionsRepository.find();
  }

  findOne(id: string): Promise<Position> {
    return this.positionsRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updatePositionDto: UpdatePositionDto): Promise<Position> {
    await this.positionsRepository.update(id, updatePositionDto);
    return this.positionsRepository.findOne({ where: { id: id } });
  }

  async remove(id: string): Promise<void> {
    await this.positionsRepository.delete(id);
  }
}
