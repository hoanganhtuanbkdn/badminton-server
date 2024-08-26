import { IsString, IsNotEmpty, IsDecimal } from 'class-validator';
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
    description: 'End time of the time slot in HH:mm format',
    example: '09:30',
  })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({
    description: 'Fixed fee for booking during this time slot',
    example: 100000,
  })
  @IsDecimal()
  fixedFee: number;

  @ApiProperty({
    description: 'Walk-in fee for booking during this time slot',
    example: 150000,
  })
  @IsDecimal()
  walkInFee: number;

  @ApiProperty({
    description: 'ID of the court associated with this time slot',
    example: 'courtId',
  })
  @IsString()
  @IsNotEmpty()
  courtId: string;
}
