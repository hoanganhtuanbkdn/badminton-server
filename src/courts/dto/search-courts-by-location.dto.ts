import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchCourtsByLocationDto {
  @ApiPropertyOptional({
    description: 'Latitude of the client (e.g., 16.067528)',
    nullable: true,
  })
  latitude?: number | null;

  @ApiPropertyOptional({
    description: 'Longitude of the client (e.g., 108.207244)',
    nullable: true,
  })
  longitude?: number | null;

  @ApiPropertyOptional({
    description: 'Search radius in meters (e.g., 500)',
    nullable: true,
  })
  radius?: number | null;

  @ApiPropertyOptional({
    description: 'Date for booking (e.g., 2023-06-01)',
    nullable: true,
  })
  bookingDate?: Date | null;

  @ApiPropertyOptional({
    description: 'Start time for booking (HH:mm) (e.g., 14:00)',
    nullable: true,
  })
  startTime?: string | null;

  @ApiPropertyOptional({
    description: 'Duration of booking in minutes (e.g., 60)',
    nullable: true,
  })
  duration?: number | null;

  @ApiPropertyOptional({
    description: 'Number of courts to book (e.g., 1)',
    nullable: true,
  })
  numberOfCourts?: number | null;

  @ApiPropertyOptional({
    description: 'Page number for pagination (e.g., 1)',
    nullable: true,
  })
  page?: number | null;

  @ApiPropertyOptional({
    description: 'Number of items per page (e.g., 10)',
    nullable: true,
  })
  limit?: number | null;
}
