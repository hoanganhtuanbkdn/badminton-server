import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

import { ROLE } from '../constants/role.constant';
import { Transform } from 'class-transformer';

export class RegisterInput {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  name: string;

  @ApiProperty()
  @MaxLength(200)
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 100)
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  // These keys can only be set by ADMIN user.
  roles: ROLE[] = [ROLE.USER];
  isAccountDisabled: boolean;
}
