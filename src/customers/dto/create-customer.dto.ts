import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Name of the customer',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  // @ApiProperty({
  //   description: 'Email address of the customer',
  //   example: 'johndoe@example.com',
  // })
  // @IsEmail()
  // @IsOptional()
  // email: string;

  @ApiProperty({
    description: 'Additional notes about the customer',
    example: 'VIP customer',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
