import { IsString, IsEmail, IsNotEmpty, Length, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOwnerDto {
  @ApiProperty({ description: 'Tên của chủ (Owner)', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Slug của chủ', example: 'john-doe' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ description: 'Email của chủ', example: 'owner@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Số điện thoại của chủ', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Tên tài khoản ngân hàng. Nhập tiếng Việt không dấu, viết hoa, tối thiểu 5 ký tự, tối đa 50 kí tự, không chứa các ký tự đặc biệt.',
    example: 'JOHN DOE',
  })
  @IsString()
  @Length(5, 50)
  @Matches(/^[A-Z0-9 ]+$/, { message: 'Account name must contain only uppercase letters, numbers, and spaces.' })
  @IsOptional()
  accountName?: string;

  @ApiPropertyOptional({
    description: 'Tên ngân hàng',
    example: 'Bank of America',
  })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiProperty({
    description: 'Số tài khoản ngân hàng thụ hưởng. Chỉ nhập số, tối thiểu 6 ký tự, tối đa 19 kí tự',
    example: '1234567890',
  })
  @IsString()
  @Length(6, 19)
  @Matches(/^\d+$/, { message: 'Số tài khoản ngân hàng thụ hưởng. Chỉ nhập số, tối thiểu 6 ký tự, tối đa 19 kí tự.' })
  @IsOptional()
  accountNo?: string;
}
