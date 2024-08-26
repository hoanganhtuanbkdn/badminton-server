import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { Owner } from './owners.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Owner])],
  controllers: [OwnersController],
  providers: [OwnersService],
})
export class OwnersModule { }
