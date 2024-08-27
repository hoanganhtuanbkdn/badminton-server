import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionDto {
  @ApiProperty({
    description: 'Name of the position',
    example: 'Position 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the position (optional)',
    example: 'This is a corner position.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Court ID associated with the position',
    example: 'courtId',
  })
  @IsString()
  @IsNotEmpty()
  courtId: string;
}
