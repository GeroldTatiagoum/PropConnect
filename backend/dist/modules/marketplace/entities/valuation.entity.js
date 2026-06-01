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
exports.Valuation = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../../properties/entities/property.entity");
let Valuation = class Valuation {
};
exports.Valuation = Valuation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Valuation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', unique: true }),
    __metadata("design:type", String)
], Valuation.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => property_entity_1.Property),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], Valuation.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_value', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Valuation.prototype, "estimatedValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value_range_low', type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Valuation.prototype, "valueRangeLow", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value_range_high', type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Valuation.prototype, "valueRangeHigh", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'confidence_score', type: 'decimal', precision: 3, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Valuation.prototype, "confidenceScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Valuation.prototype, "factors", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'algorithm_version', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], Valuation.prototype, "algorithmVersion", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Valuation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Valuation.prototype, "updatedAt", void 0);
exports.Valuation = Valuation = __decorate([
    (0, typeorm_1.Entity)('valuations'),
    (0, typeorm_1.Index)('idx_valuations_property', ['propertyId'])
], Valuation);
//# sourceMappingURL=valuation.entity.js.map