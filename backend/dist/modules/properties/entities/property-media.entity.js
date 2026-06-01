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
exports.PropertyMedia = exports.MediaType = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("./property.entity");
var MediaType;
(function (MediaType) {
    MediaType["PHOTO"] = "photo";
    MediaType["VIDEO"] = "video";
    MediaType["FLOOR_PLAN"] = "floor_plan";
    MediaType["VIRTUAL_TOUR"] = "virtual_tour";
})(MediaType || (exports.MediaType = MediaType = {}));
let PropertyMedia = class PropertyMedia {
};
exports.PropertyMedia = PropertyMedia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PropertyMedia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id' }),
    __metadata("design:type", String)
], PropertyMedia.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (p) => p.media, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], PropertyMedia.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'media_type', type: 'enum', enum: MediaType }),
    __metadata("design:type", String)
], PropertyMedia.prototype, "mediaType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 's3_url', length: 500 }),
    __metadata("design:type", String)
], PropertyMedia.prototype, "s3Url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 's3_key', length: 500 }),
    __metadata("design:type", String)
], PropertyMedia.prototype, "s3Key", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thumbnail_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], PropertyMedia.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_size_bytes', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], PropertyMedia.prototype, "fileSizeBytes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], PropertyMedia.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], PropertyMedia.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PropertyMedia.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PropertyMedia.prototype, "createdAt", void 0);
exports.PropertyMedia = PropertyMedia = __decorate([
    (0, typeorm_1.Entity)('property_media'),
    (0, typeorm_1.Index)('idx_property_media_property', ['propertyId']),
    (0, typeorm_1.Index)('idx_property_media_order', ['propertyId', 'displayOrder'])
], PropertyMedia);
//# sourceMappingURL=property-media.entity.js.map