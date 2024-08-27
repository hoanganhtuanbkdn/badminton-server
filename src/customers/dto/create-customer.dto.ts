import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Name of the customer',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Additional notes about the customer',
    example: 'VIP customer',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
