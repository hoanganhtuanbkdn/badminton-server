import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Lead } from 'src/lead/entities/lead.entity';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsOptional()
  isRead?: boolean = false;

  @IsOptional()
  lead: Lead;
}
