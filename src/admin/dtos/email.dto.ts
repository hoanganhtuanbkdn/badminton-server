import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { requireFieldLength, requireFieldNotEmpty } from 'src/shared/constants';

export class EmailInput {
  @IsNotEmpty({ message: requireFieldNotEmpty('email') })
  @IsEmail()
  @MaxLength(250, { message: requireFieldLength('email', '250') })
  @ApiProperty({
    type: String,
    default: 'vnhung1@cmcglobal.vn',
    description: 'email',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
