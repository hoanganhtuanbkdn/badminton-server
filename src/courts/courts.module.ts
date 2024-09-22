import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { Court } from './courts.entity';
import { Owner } from 'src/owners/owners.entity';
import { PositionsModule } from 'src/positions/positions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Court, Owner]), PositionsModule],
  providers: [CourtsService],
  controllers: [CourtsController],
})
export class CourtsModule { }
