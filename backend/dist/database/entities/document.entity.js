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
exports.Document = exports.DocumentSide = exports.DocumentType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../modules/users/entities/user.entity");
var DocumentType;
(function (DocumentType) {
    DocumentType["IDENTITY_CARD"] = "identity_card";
    DocumentType["PASSPORT"] = "passport";
    DocumentType["DRIVING_LICENSE"] = "driving_license";
    DocumentType["CADASTRAL_MAP"] = "cadastral_map";
    DocumentType["APE"] = "ape";
    DocumentType["FLOOR_PLAN"] = "floor_plan";
    DocumentType["UTILITY_BILL"] = "utility_bill";
    DocumentType["PROPERTY_DEED"] = "property_deed";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentSide;
(function (DocumentSide) {
    DocumentSide["FRONT"] = "front";
    DocumentSide["BACK"] = "back";
    DocumentSide["FULL"] = "full";
})(DocumentSide || (exports.DocumentSide = DocumentSide = {}));
let Document = class Document {
};
exports.Document = Document;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Document.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Document.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Document.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], Document.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'document_type', type: 'enum', enum: DocumentType }),
    __metadata("design:type", String)
], Document.prototype, "documentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 's3_path', length: 500 }),
    __metadata("design:type", String)
], Document.prototype, "s3Path", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 's3_key', length: 500, unique: true }),
    __metadata("design:type", String)
], Document.prototype, "s3Key", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_size_bytes', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Document.prototype, "fileSizeBytes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_mime_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Document.prototype, "fileMimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ocr_extracted_text', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Document.prototype, "ocrExtractedText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_verified', default: false }),
    __metadata("design:type", Boolean)
], Document.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verified_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Document.prototype, "verifiedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verified_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Document.prototype, "verifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verification_notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Document.prototype, "verificationNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'document_side',
        type: 'enum',
        enum: DocumentSide,
        default: DocumentSide.FULL,
    }),
    __metadata("design:type", String)
], Document.prototype, "documentSide", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Document.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Document.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Document.prototype, "expiresAt", void 0);
exports.Document = Document = __decorate([
    (0, typeorm_1.Entity)('documents'),
    (0, typeorm_1.Index)('idx_documents_user', ['userId']),
    (0, typeorm_1.Index)('idx_documents_property', ['propertyId']),
    (0, typeorm_1.Index)('idx_documents_type', ['documentType']),
    (0, typeorm_1.Index)('idx_documents_verified', ['isVerified'])
], Document);
//# sourceMappingURL=document.entity.js.map