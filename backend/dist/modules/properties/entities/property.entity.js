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
exports.Property = exports.PropertyCondition = exports.PropertyStatus = exports.PropertyType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const property_media_entity_1 = require("./property-media.entity");
var PropertyType;
(function (PropertyType) {
    PropertyType["APARTMENT"] = "apartment";
    PropertyType["HOUSE"] = "house";
    PropertyType["VILLA"] = "villa";
    PropertyType["COMMERCIAL"] = "commercial";
    PropertyType["LAND"] = "land";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["DRAFT"] = "draft";
    PropertyStatus["PENDING_VERIFICATION"] = "pending_verification";
    PropertyStatus["PUBLISHED"] = "published";
    PropertyStatus["ARCHIVED"] = "archived";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
var PropertyCondition;
(function (PropertyCondition) {
    PropertyCondition["NEW"] = "new";
    PropertyCondition["GOOD"] = "good";
    PropertyCondition["FAIR"] = "fair";
    PropertyCondition["NEEDS_RENOVATION"] = "needs_renovation";
})(PropertyCondition || (exports.PropertyCondition = PropertyCondition = {}));
let Property = class Property {
    get pricePerSqm() {
        return Math.round(this.price / this.totalAreaSqm);
    }
};
exports.Property = Property;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Property.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seller_id' }),
    __metadata("design:type", String)
], Property.prototype, "sellerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'seller_id' }),
    __metadata("design:type", user_entity_1.User)
], Property.prototype, "seller", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], Property.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'postal_code', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Property.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Property.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: 'IT' }),
    __metadata("design:type", String)
], Property.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8 }),
    __metadata("design:type", Number)
], Property.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8 }),
    __metadata("design:type", Number)
], Property.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PropertyType }),
    (0, typeorm_1.Column)({ name: 'property_type', type: 'enum', enum: PropertyType }),
    __metadata("design:type", String)
], Property.prototype, "propertyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sub_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "subType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'rooms_count', type: 'smallint' }),
    __metadata("design:type", Number)
], Property.prototype, "roomsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'bathrooms_count', type: 'smallint', nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "bathroomsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'total_area_sqm', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Property.prototype, "totalAreaSqm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'land_area_sqm', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "landAreaSqm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Property.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currency', length: 3, default: 'EUR' }),
    __metadata("design:type", String)
], Property.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PropertyStatus }),
    (0, typeorm_1.Column)({ type: 'enum', enum: PropertyStatus, default: PropertyStatus.DRAFT }),
    __metadata("design:type", String)
], Property.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'published_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'view_count', default: 0 }),
    __metadata("design:type", Number)
], Property.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_request_count', default: 0 }),
    __metadata("design:type", Number)
], Property.prototype, "contactRequestCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'year_built', type: 'smallint', nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "yearBuilt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PropertyCondition, nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'heating_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "heatingType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cooling_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "coolingType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_furnished', default: false }),
    __metadata("design:type", Boolean)
], Property.prototype, "isFurnished", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_elevator', default: false }),
    __metadata("design:type", Boolean)
], Property.prototype, "hasElevator", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_parking', default: false }),
    __metadata("design:type", Boolean)
], Property.prototype, "hasParking", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_terrace', default: false }),
    __metadata("design:type", Boolean)
], Property.prototype, "hasTerrace", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_garden', default: false }),
    __metadata("design:type", Boolean)
], Property.prototype, "hasGarden", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'energy_class', type: 'varchar', length: 1, nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "energyClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Property.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Property.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_media_entity_1.PropertyMedia, (m) => m.property),
    __metadata("design:type", Array)
], Property.prototype, "media", void 0);
exports.Property = Property = __decorate([
    (0, typeorm_1.Entity)('properties'),
    (0, typeorm_1.Index)('idx_properties_seller', ['sellerId']),
    (0, typeorm_1.Index)('idx_properties_status', ['status']),
    (0, typeorm_1.Index)('idx_properties_type', ['propertyType']),
    (0, typeorm_1.Index)('idx_properties_published', ['publishedAt']),
    (0, typeorm_1.Index)('idx_properties_coords', ['latitude', 'longitude']),
    (0, typeorm_1.Index)('idx_properties_price', ['price']),
    (0, typeorm_1.Check)('valid_coords', '"latitude" >= -90 AND "latitude" <= 90 AND "longitude" >= -180 AND "longitude" <= 180')
], Property);
//# sourceMappingURL=property.entity.js.map