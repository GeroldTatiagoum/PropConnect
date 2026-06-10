import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Property,
  PropertyStatus,
} from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyFilterDto } from './dto/property-filter.dto';
import { UserRole } from '../users/entities/user.entity';
import { LoggerService } from '../../shared/services/logger.service';
import { RedisService } from '../../shared/services/redis.service';

const PROPERTY_CACHE_TTL = 300; // 5 minutes

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly redis: RedisService,
    private readonly logger: LoggerService,
  ) {}

  async create(sellerId: string, dto: CreatePropertyDto): Promise<Property> {
    this.logger.debug(`create: sellerId=${sellerId} type=${dto.propertyType} price=${dto.price}`, 'PropertiesService');
    const property = this.propertyRepo.create({ ...dto, sellerId });
    const saved = await this.propertyRepo.save(property);
    this.logger.log(`create success: propertyId=${saved.id} sellerId=${sellerId}`, 'PropertiesService');
    return saved;
  }

  async findById(id: string): Promise<Property> {
    this.logger.debug(`findById: id=${id}`, 'PropertiesService');
    const cacheKey = `property:${id}`;
    const cached = await this.redis.getJson<Property>(cacheKey);
    if (cached) {
      this.logger.debug(`findById cache HIT: id=${id}`, 'PropertiesService');
      return cached;
    }

    this.logger.debug(`findById cache MISS: id=${id} — querying DB`, 'PropertiesService');
    const property = await this.propertyRepo.findOne({
      where: { id },
      relations: ['seller', 'media'],
    });

    if (!property) {
      this.logger.warn(`findById not found: id=${id}`, 'PropertiesService');
      throw new NotFoundException('Property not found');
    }

    if (property.status === PropertyStatus.PUBLISHED) {
      await this.redis.setJson(cacheKey, property, PROPERTY_CACHE_TTL);
      this.logger.debug(`findById cached: id=${id} ttl=${PROPERTY_CACHE_TTL}s`, 'PropertiesService');
    }

    return property;
  }

  async findAll(
    filters: PropertyFilterDto,
    requestingUserId?: string,
    requestingUserRole?: UserRole,
  ): Promise<{ data: Property[]; pagination: Record<string, number | boolean> }> {
    const {
      status,
      minPrice,
      maxPrice,
      rooms,
      propertyType,
      latitude,
      longitude,
      radius,
      page = 1,
      limit = 20,
      sort = 'date_desc',
    } = filters;

    const qb = this.propertyRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.media', 'm')
      .where('1=1');

    // Visibility rules
    if (!requestingUserRole || requestingUserRole === UserRole.BUYER) {
      qb.andWhere('p.status = :pub', { pub: PropertyStatus.PUBLISHED });
    } else if (requestingUserRole === UserRole.SELLER && requestingUserId) {
      qb.andWhere('(p.status = :pub OR p.seller_id = :sid)', {
        pub: PropertyStatus.PUBLISHED,
        sid: requestingUserId,
      });
    }

    if (status) qb.andWhere('p.status = :status', { status });
    if (minPrice !== undefined) qb.andWhere('p.price >= :minPrice', { minPrice });
    if (maxPrice !== undefined) qb.andWhere('p.price <= :maxPrice', { maxPrice });
    if (rooms !== undefined) qb.andWhere('p.rooms_count = :rooms', { rooms });
    if (propertyType) qb.andWhere('p.property_type = :propertyType', { propertyType });

    if (latitude !== undefined && longitude !== undefined && radius !== undefined) {
      qb.andWhere(
        `(6371 * acos(
          cos(radians(:lat)) * cos(radians(p.latitude)) *
          cos(radians(p.longitude) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(p.latitude))
        )) <= :radius`,
        { lat: latitude, lng: longitude, radius },
      );
    }

    const [column, direction] = this.parseSortParam(sort);
    qb.orderBy(`p.${column}`, direction as 'ASC' | 'DESC');

    this.logger.debug(
      `findAll: role=${requestingUserRole ?? 'public'} userId=${requestingUserId ?? '-'} filters=${JSON.stringify({ status, minPrice, maxPrice, rooms, propertyType, latitude, longitude, radius })} page=${page} limit=${limit} sort=${sort}`,
      'PropertiesService',
    );

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    this.logger.debug(`findAll result: total=${total} returned=${data.length} page=${page}`, 'PropertiesService');

    const pages = Math.ceil(total / limit);
    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
    };
  }

  async findBySeller(
    sellerId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: Property[]; pagination: Record<string, number | boolean> }> {
    const [data, total] = await this.propertyRepo.findAndCount({
      where: { sellerId },
      relations: ['media'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pages = Math.ceil(total / limit);
    return {
      data,
      pagination: { total, page, limit, pages, hasNext: page < pages, hasPrev: page > 1 },
    };
  }

  async update(
    id: string,
    sellerId: string,
    patch: Partial<CreatePropertyDto>,
  ): Promise<Property> {
    this.logger.debug(`update: propertyId=${id} sellerId=${sellerId} fields=${Object.keys(patch).join(',')}`, 'PropertiesService');

    const property = await this.findById(id);

    if (property.sellerId !== sellerId) {
      this.logger.warn(`update forbidden: propertyId=${id} requestedBy=${sellerId} owner=${property.sellerId}`, 'PropertiesService');
      throw new ForbiddenException('You can only update your own listings');
    }

    if (property.status === PropertyStatus.ARCHIVED) {
      this.logger.warn(`update rejected: propertyId=${id} reason=archived`, 'PropertiesService');
      throw new ForbiddenException('Cannot update an archived listing');
    }

    Object.assign(property, patch);
    const updated = await this.propertyRepo.save(property);
    await this.redis.del(`property:${id}`);
    this.logger.log(`update success: propertyId=${id}`, 'PropertiesService');
    return updated;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.propertyRepo.increment({ id }, 'viewCount', 1);
    await this.redis.del(`property:${id}`);
  }

  async findAllAdmin(
    statusFilter: PropertyStatus | undefined,
    page = 1,
    limit = 20,
  ): Promise<{ data: Property[]; pagination: Record<string, number | boolean> }> {
    const qb = this.propertyRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.media', 'm')
      .leftJoinAndSelect('p.seller', 's')
      .where('1=1');
    if (statusFilter) qb.andWhere('p.status = :status', { status: statusFilter });
    qb.orderBy('p.created_at', 'DESC');
    const total = await qb.getCount();
    const data = await qb.skip((page - 1) * limit).take(limit).getMany();
    const pages = Math.ceil(total / limit);
    return { data, pagination: { total, page, limit, pages, hasNext: page < pages, hasPrev: page > 1 } };
  }

  async getPropertyStats(): Promise<Record<string, number>> {
    const rows = await this.propertyRepo
      .createQueryBuilder('p')
      .select('p.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('p.status')
      .getRawMany();
    return Object.fromEntries(rows.map((r) => [r.status, Number(r.count)]));
  }

  async changeStatus(
    id: string,
    status: PropertyStatus,
    actorRole: UserRole,
  ): Promise<Property> {
    this.logger.debug(`changeStatus: propertyId=${id} newStatus=${status} actorRole=${actorRole}`, 'PropertiesService');

    const property = await this.findById(id);

    const brokerOrAdmin = [UserRole.BROKER, UserRole.ADMIN].includes(actorRole);
    if (status === PropertyStatus.PUBLISHED && !brokerOrAdmin) {
      this.logger.warn(`changeStatus forbidden: propertyId=${id} status=${status} actorRole=${actorRole}`, 'PropertiesService');
      throw new ForbiddenException('Only a broker or admin can publish listings');
    }

    const previousStatus = property.status;
    property.status = status;
    if (status === PropertyStatus.PUBLISHED) {
      property.publishedAt = new Date();
    }

    const saved = await this.propertyRepo.save(property);
    await this.redis.del(`property:${id}`);
    this.logger.log(`changeStatus success: propertyId=${id} ${previousStatus} → ${status}`, 'PropertiesService');
    return saved;
  }

  private parseSortParam(sort: string): [string, string] {
    const map: Record<string, [string, string]> = {
      date_desc: ['createdAt', 'DESC'],
      date_asc: ['createdAt', 'ASC'],
      price_desc: ['price', 'DESC'],
      price_asc: ['price', 'ASC'],
    };
    return map[sort] ?? ['createdAt', 'DESC'];
  }
}
