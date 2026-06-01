import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyFilterDto } from './dto/property-filter.dto';
import { User } from '../users/entities/user.entity';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    create(user: User, dto: CreatePropertyDto): Promise<import("./entities/property.entity").Property>;
    findAll(filters: PropertyFilterDto): Promise<{
        data: import("./entities/property.entity").Property[];
        pagination: Record<string, number | boolean>;
    }>;
    findOne(id: string): Promise<import("./entities/property.entity").Property>;
    update(id: string, user: User, dto: Partial<CreatePropertyDto>): Promise<import("./entities/property.entity").Property>;
}
//# sourceMappingURL=properties.controller.d.ts.map