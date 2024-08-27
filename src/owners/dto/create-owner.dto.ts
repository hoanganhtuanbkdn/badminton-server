import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOwnerDto {
  @ApiProperty({ description: 'Tên của chủ (Owner)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email của chủ' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Số điện thoại của chủ' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
