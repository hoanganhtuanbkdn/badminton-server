import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { Position } from './positions.entity';
import { Court } from 'src/courts/courts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Position, Court])],
  providers: [PositionsService],
  controllers: [PositionsController],
  exports: [PositionsService],
})
export class PositionsModule { }
