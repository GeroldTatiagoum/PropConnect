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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketData = void 0;
const typeorm_1 = require("typeorm");
let MarketData = class MarketData {
};
exports.MarketData = MarketData;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MarketData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_name', length: 255 }),
    __metadata("design:type", String)
], MarketData.prototype, "zoneName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8 }),
    __metadata("design:type", Number)
], MarketData.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8 }),
    __metadata("design:type", Number)
], MarketData.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_type', length: 100 }),
    __metadata("design:type", String)
], MarketData.prototype, "propertyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_recorded', type: 'date' }),
    __metadata("design:type", String)
], MarketData.prototype, "dateRecorded", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avg_price_per_sqm', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], MarketData.prototype, "avgPricePerSqm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_price_per_sqm', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], MarketData.prototype, "minPricePerSqm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_price_per_sqm', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], MarketData.prototype, "maxPricePerSqm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avg_days_to_sale', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], MarketData.prototype, "avgDaysToSale", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'active_listings_count', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], MarketData.prototype, "activeListingsCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sold_count_last_30_days', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], MarketData.prototype, "soldCountLast30Days", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MarketData.prototype, "createdAt", void 0);
exports.MarketData = MarketData = __decorate([
    (0, typeorm_1.Entity)('market_data'),
    (0, typeorm_1.Index)('idx_market_data_zone', ['zoneName']),
    (0, typeorm_1.Index)('idx_market_data_date', ['dateRecorded']),
    (0, typeorm_1.Index)('idx_market_data_type', ['propertyType']),
    (0, typeorm_1.Unique)('unique_market_data', ['zoneName', 'propertyType', 'dateRecorded'])
], MarketData);
//# sourceMappingURL=market-data.entity.js.map