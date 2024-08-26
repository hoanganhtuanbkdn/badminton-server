import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto, UpdateOwnerDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('owners')
@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) { }

  @Post()
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.create(createOwnerDto);
  }

  @Get()
  findAll() {
    return this.ownersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ownersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.ownersService.update(id, updateOwnerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ownersService.remove(id);
  }
}
