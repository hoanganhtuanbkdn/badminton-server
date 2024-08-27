import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { Court } from './courts.entity';
import { Owner } from 'src/owners/owners.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Court, Owner])],
  providers: [CourtsService],
  controllers: [CourtsController],
})
export class CourtsModule { }
