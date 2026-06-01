"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_2 = require("@nestjs/swagger");
const marketplace_service_1 = require("./marketplace.service");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
class MarketOverviewQuery {
    constructor() {
        this.radius = 5;
    }
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MarketOverviewQuery.prototype, "latitude", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MarketOverviewQuery.prototype, "longitude", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ default: 5 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MarketOverviewQuery.prototype, "radius", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MarketOverviewQuery.prototype, "propertyType", void 0);
class ComparablesQuery {
}
__decorate([
    (0, swagger_2.ApiProperty)({ required: false, default: 10 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComparablesQuery.prototype, "maxResults", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false, default: 0.8 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComparablesQuery.prototype, "similarity", void 0);
let MarketplaceController = class MarketplaceController {
    constructor(marketplaceService) {
        this.marketplaceService = marketplaceService;
    }
    getOverview(query) {
        return this.marketplaceService.getMarketOverview({
            latitude: query.latitude,
            longitude: query.longitude,
            radius: query.radius,
            propertyType: query.propertyType,
        });
    }
    getValuation(propertyId) {
        return this.marketplaceService.getOrComputeValuation(propertyId);
    }
    getComparables(propertyId, query) {
        return this.marketplaceService.getComparables(propertyId, query.maxResults, query.similarity);
    }
};
exports.MarketplaceController = MarketplaceController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get market data overview for a zone' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Market data summary' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MarketOverviewQuery]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('valuations/:propertyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI-powered property valuation' }),
    (0, swagger_1.ApiParam)({ name: 'propertyId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property valuation' }),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getValuation", null);
__decorate([
    (0, common_1.Get)('comparables'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comparable properties' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comparable properties list' }),
    __param(0, (0, common_1.Query)('propertyId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ComparablesQuery]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getComparables", null);
exports.MarketplaceController = MarketplaceController = __decorate([
    (0, swagger_1.ApiTags)('Marketplace'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('marketplace'),
    __metadata("design:paramtypes", [marketplace_service_1.MarketplaceService])
], MarketplaceController);
//# sourceMappingURL=marketplace.controller.js.map