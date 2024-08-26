import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateNoteDto {
  readonly creatorId?: string;
  readonly leadId?: string;
  readonly parentNoteId?: string;

  @ApiProperty({ description: 'content', example: '' })
  @IsNotEmpty({ message: 'Content should not be empty' })
  content: string;
}
