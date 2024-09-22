import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourtDto {
  @ApiProperty({
    description: 'Name of the court',
    example: 'Court 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Address of the court',
    example: '123 Main St, City, Country',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Latitude of the court',
    example: 21.028511,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude of the court',
    example: 105.804817,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Phone number for contact (optional)',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Banner image URL for the court (optional)',
    example: 'https://example.com/banner.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @ApiProperty({
    description: 'Owner ID to whom this court belongs',
    example: 'ownerId',
  })
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({
    description: 'duration',
    example: 1,
  })
  @IsOptional()
  duration: number;

  @ApiProperty({
    description: 'Fixed fee for booking during this time slot',
    example: 100000,
  })
  @IsOptional()
  fixedFee: number;

  @ApiProperty({
    description: 'Walk-in fee for booking during this time slot',
    example: 150000,
  })
  @IsOptional()
  walkInFee: number;
}
