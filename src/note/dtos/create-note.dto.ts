import { ApiPropertyOptional } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

const { CREATE, UPDATE } = CrudValidationGroups;

export class CreateNoteDto {

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @ApiPropertyOptional({
    description: 'content',
    default: ""
  })
  content: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @ApiPropertyOptional({
    description: 'leadId',
    default: ""
  })
  leadId: string;

  @IsOptional({ groups: [UPDATE] })
  @IsOptional({ groups: [CREATE] })
  @IsString({ always: true })
  @ApiPropertyOptional({
    description: 'leadId',
    default: ""
  })
  parentNoteId: string;

  @IsOptional({ groups: [UPDATE] })
  @IsOptional({ groups: [CREATE] })
  @IsString({ always: true })
  @ApiPropertyOptional({
    description: 'creatorId',
    default: ""
  })
  creatorId: string;
}
