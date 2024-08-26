import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TimeSlotsService } from './timeslots.service';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('timeslots')
@Controller('timeslots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) { }

  @Post()
  create(@Body() createTimeSlotDto: CreateTimeSlotDto) {
    return this.timeSlotsService.create(createTimeSlotDto);
  }

  @Get()
  findAll() {
    return this.timeSlotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeSlotsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTimeSlotDto: UpdateTimeSlotDto) {
    return this.timeSlotsService.update(id, updateTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeSlotsService.remove(id);
  }
}
