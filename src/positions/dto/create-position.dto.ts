import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionDto {
  @ApiProperty({
    description: 'Name of the position',
    example: 'Position A',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the position',
    example: 'This is a description for Position A',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID of the court associated with this position',
    example: 'courtId',
  })
  @IsString()
  @IsNotEmpty()
  courtId: string;
}
