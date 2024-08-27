import { IsString, IsNotEmpty } from 'class-validator';
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
    description: 'Geographical coordinates of the court',
    example: '40.7128,-74.0060',
  })
  @IsString()
  @IsNotEmpty()
  coordinate: string;

  @ApiProperty({
    description: 'Phone number for contact',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Banner image URL for the court',
    example: 'https://example.com/banner.jpg',
  })
  @IsString()
  @IsNotEmpty()
  banner: string;
}
