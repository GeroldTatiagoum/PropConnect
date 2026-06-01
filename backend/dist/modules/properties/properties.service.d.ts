import { Repository } from 'typeorm';
import { Property, PropertyStatus } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyFilterDto } from './dto/property-filter.dto';
import { UserRole } from '../users/entities/user.entity';
import { LoggerService } from '../../shared/services/logger.service';
import { RedisService } from '../../shared/services/redis.service';
export declare class PropertiesService {
    private readonly propertyRepo;
    private readonly redis;
    private readonly logger;
    constructor(propertyRepo: Repository<Property>, redis: RedisService, logger: LoggerService);
    create(sellerId: string, dto: CreatePropertyDto): Promise<Property>;
    findById(id: string): Promise<Property>;
    findAll(filters: PropertyFilterDto, requestingUserId?: string, requestingUserRole?: UserRole): Promise<{
        data: Property[];
        pagination: Record<string, number | boolean>;
    }>;
    update(id: string, sellerId: string, patch: Partial<CreatePropertyDto>): Promise<Property>;
    incrementViewCount(id: string): Promise<void>;
    changeStatus(id: string, status: PropertyStatus, actorRole: UserRole): Promise<Property>;
    private parseSortParam;
}
//# sourceMappingURL=properties.service.d.ts.map