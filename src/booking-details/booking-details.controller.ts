import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { CreateBookingDetailDto, UpdateBookingDetailDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('booking-details')
@Controller('booking-details')
export class BookingDetailsController {
  constructor(private readonly bookingDetailsService: BookingDetailsService) { }

  @Post()
  create(@Body() createBookingDetailDto: CreateBookingDetailDto) {
    return this.bookingDetailsService.create(createBookingDetailDto);
  }

  @Get()
  findAll() {
    return this.bookingDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingDetailsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookingDetailDto: UpdateBookingDetailDto) {
    return this.bookingDetailsService.update(id, updateBookingDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingDetailsService.remove(id);
  }
}
