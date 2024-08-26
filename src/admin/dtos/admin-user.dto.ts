import { ApiPropertyOptional } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  ACCOUNT_STATUS,
  AGENCY_APPLY_FOR,
  AGENCY_ROLE,
  REGEX_PASSWORD,
  requireFieldLength,
  requireFieldMinLength,
} from 'src/shared/constants';

const { CREATE, UPDATE } = CrudValidationGroups;

export class AdminUserDto {
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(50, { always: true })
  @ApiPropertyOptional({
    description: 'first_name',
    default: 'Hung',
  })
  firstName: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(50, { always: true })
  @ApiPropertyOptional({
    description: 'last_name',
    default: 'Vu',
  })
  lastName: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @MaxLength(20, { message: requireFieldLength('mobileNo', '10') })
  @ApiPropertyOptional({
    description: 'mobileNo',
    default: '3925888888',
  })
  @IsString()
  mobileNo: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsEmail()
  @MaxLength(200, { message: requireFieldLength('email', '200') })
  @ApiPropertyOptional({
    description: 'email',
    default: 'hungvu.it.94@gmail.com',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Matches(REGEX_PASSWORD, { message: 'ERR_MSG_FORMAT_PASSWORD' })
  @MinLength(8, { message: requireFieldMinLength('password', '8') })
  @MaxLength(16, { message: requireFieldLength('password', '16') })
  @IsString()
  // @Exclude()
  @ApiPropertyOptional({
    default: 'Welcome321!',
    description: 'password',
  })
  password: string;

  @IsOptional({ groups: [UPDATE, CREATE] })
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'image path',
    default: '',
  })
  @IsString()
  imagePath: string;

  @ValidateIf((o) => o.email !== 'hungvu.it.94@gmail.com')
  @IsNotEmpty({ groups: [UPDATE, CREATE] })
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'role',
    default: '',
  })
  @IsString()
  role: string;

  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsEnum(ACCOUNT_STATUS)
  @ApiPropertyOptional({
    description: 'status',
    default: ACCOUNT_STATUS.ACTIVE,
  })
  status: ACCOUNT_STATUS;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ApiPropertyOptional({
    description: 'roleAgency',
    default: AGENCY_ROLE.LOAN_OFFICER,
  })
  @IsEnum(AGENCY_ROLE)
  roleAgency: AGENCY_ROLE;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'NMLS',
    default: 'test NMLS',
  })
  @IsString()
  NMLS: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'apply for',
    default: AGENCY_APPLY_FOR.PERSONAL_WEBSITE_AND_DETAIL_PAGE,
  })
  @IsEnum(AGENCY_APPLY_FOR)
  applyFor: AGENCY_APPLY_FOR;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'domain',
    default: 'hungvu.com',
  })
  @IsString()
  domain: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ApiPropertyOptional({
    description: 'total_loan',
    default: 0,
  })
  @IsNumber()
  totalLoan: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ApiPropertyOptional({
    description: 'loanFunded',
    type: Number,
    default: 0,
  })
  @IsNumber()
  loanFunded: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ApiPropertyOptional({
    description: 'totalLoanFunded',
    type: Number,
    default: 0,
  })
  @IsNumber()
  totalLoanFunded: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ApiPropertyOptional({
    description: 'loanVolume',
    type: Number,
    default: 0,
  })
  @IsNumber()
  loanVolume: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'bio',
  })
  @IsString()
  bio: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ApiPropertyOptional({
    description: 'averageLoanAmount',
    type: Number,
    default: 0,
  })
  @IsNumber()
  averageLoanAmount: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'address',
  })
  @IsString()
  address: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'company',
  })
  @IsString()
  company: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'calendly',
  })
  @IsString()
  calendly: string;
}
