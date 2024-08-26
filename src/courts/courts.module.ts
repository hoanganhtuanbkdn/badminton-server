import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { Court } from './courts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Court])],
  providers: [CourtsService],
  controllers: [CourtsController],
})
export class CourtsModule { }
