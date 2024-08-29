import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimeSlotDto {
  @ApiProperty({
    description: 'Start time of the time slot in HH:mm format',
    example: '08:00',
  })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: 'Duration of the time slot',
    example: 1,
  })
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    description: 'Fixed fee for booking during this time slot',
    example: 100000,
  })
  @IsNumber()
  fixedFee: number;

  @ApiProperty({
    description: 'Walk-in fee for booking during this time slot',
    example: 150000,
  })
  @IsNumber()
  walkInFee: number;

  @ApiProperty({
    description: 'ID of the court associated with this time slot',
    example: 'courtId',
  })
  @IsString()
  @IsNotEmpty()
  courtId: string;

  @ApiProperty({
    description: 'Name of the time slot',
    example: 'Ca Sáng',
  })
  @IsString()
  name: string;
}
