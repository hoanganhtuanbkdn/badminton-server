import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from './courts.entity';
import { CreateCourtDto, UpdateCourtDto } from './dto';
import { GetCourtsDto } from './dto/get-courts.dto';
import { Owner } from 'src/owners/owners.entity';
import { SearchCourtsByLocationDto } from './dto/search-courts-by-location.dto';
import { PositionsService } from 'src/positions/positions.service';

@Injectable()
export class CourtsService {
  constructor(
    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,
    @InjectRepository(Owner)
    private ownersRepository: Repository<Owner>,
    private positionsService: PositionsService,
  ) { }

  async create(createCourtDto: any) {
    const { ownerId, ...courtData } = createCourtDto;

    const owner = await this.ownersRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new Error(`Owner with ID ${ownerId} not found`);
    }

    const court = this.courtsRepository.create({
      ...courtData,
      owner,
    });

    return this.courtsRepository.save(court);
  }

  async findAll(getCourtsDto: GetCourtsDto): Promise<{ data: Court[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = getCourtsDto;

    const [data, total] = await this.courtsRepository.findAndCount({
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      // relations: ['owner'],  
    });

    return { data, total, page, limit };
  }

  async searchByLocation(searchDto: any) {
    const now = new Date();
    console.log(1, searchDto);

    const {
      latitude,
      longitude,
      radius,
      bookingDate = now,
      startTime = now.toTimeString().slice(0, 5),
      duration = 120,
      numberOfCourts,
      page = 1,
      limit = 10
    } = searchDto;

    console.log(searchDto);
    try {
      let query = this.courtsRepository.createQueryBuilder('court');

      if (latitude && longitude && radius) {
        query = query
          .addSelect(`(6371000 * acos(cos(radians(:latitude)) * cos(radians(court.latitude)) * cos(radians(court.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(court.latitude))))`, 'distance')
          .setParameters({
            latitude: Number(latitude),
            longitude: Number(longitude)
          })
          .where('(6371000 * acos(cos(radians(:latitude)) * cos(radians(court.latitude)) * cos(radians(court.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(court.latitude)))) <= :radius', { radius: Number(radius) })
          .orderBy('distance', 'ASC');
      }

      const [courts, total] = await query
        .skip((Number(page) - 1) * Number(limit))
        .take(Number(limit))
        .getManyAndCount();

      const courtsWithDetails = await Promise.all(courts.map(async (court) => {
        const availablePositions = await this.positionsService.findAvailablePositions(court.id, startTime, duration, bookingDate);
        let courtWithDetails = {
          ...court,
          availablePositionsCount: availablePositions.length,
        };

        if (latitude && longitude && court.latitude && court.longitude) {
          const earthRadius = 6371; // Earth's radius in km
          const latDiff = (court.latitude - latitude) * (Math.PI / 180);
          const lonDiff = (court.longitude - longitude) * (Math.PI / 180);
          const haversine =
            Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
            Math.cos(latitude * (Math.PI / 180)) * Math.cos(court.latitude * (Math.PI / 180)) *
            Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
          const centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
          const distanceInMeters = Number((earthRadius * centralAngle * 1000).toFixed(2)); // Convert to meters and round to 2 decimal places
          const formattedDistance = `${distanceInMeters} m`;

          courtWithDetails = {
            ...courtWithDetails,
            distanceInMeters,
            formattedDistance
          } as any;
        }

        return courtWithDetails;
      }));

      return {
        data: courtsWithDetails,
        total,
        page: Number(page),
        limit: Number(limit)
      };
    } catch (error) {
      throw new Error(`Failed to search courts: ${error.message}`);
    }
  }

  async findByOwnerId(ownerId: string): Promise<Court[]> {
    const owner = await this.ownersRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${ownerId} not found`);
    }
    return this.courtsRepository.find({ where: { ownerId } });
  }

  async findOne(id: string, latitude?: number, longitude?: number) {
    const court = await this.courtsRepository.findOne({ where: { id } });

    if (!court) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }

    if (latitude && longitude && court.latitude && court.longitude) {
      const R = 6371; // Earth's radius in km
      const dLat = (court.latitude - latitude) * (Math.PI / 180);
      const dLon = (court.longitude - longitude) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(latitude * (Math.PI / 180)) * Math.cos(court.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = Number((R * c * 1000).toFixed(2)); // Convert to meters and round to 2 decimal places
      const distanceWithUnit = `${distance} m`;

      return { ...court, distance, distanceWithUnit };
    }

    return { ...court };
  }

  async update(id: string, updateCourtDto: any): Promise<Court> {
    await this.courtsRepository.update(id, updateCourtDto);
    return this.courtsRepository.findOne({ where: { id: id } });
  }

  async remove(id: string): Promise<void> {
    await this.courtsRepository.delete(id);
  }
}
