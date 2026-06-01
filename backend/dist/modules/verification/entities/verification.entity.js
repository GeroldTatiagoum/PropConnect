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
exports.Verification = exports.VerificationPriority = exports.VerificationStatus = exports.VerificationType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var VerificationType;
(function (VerificationType) {
    VerificationType["KYC_USER"] = "kyc_user";
    VerificationType["KYC_SELLER"] = "kyc_seller";
    VerificationType["PROPERTY_DOCUMENTS"] = "property_documents";
    VerificationType["FINANCIAL_CAPACITY"] = "financial_capacity";
})(VerificationType || (exports.VerificationType = VerificationType = {}));
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["PENDING"] = "pending";
    VerificationStatus["IN_REVIEW"] = "in_review";
    VerificationStatus["APPROVED"] = "approved";
    VerificationStatus["REJECTED"] = "rejected";
    VerificationStatus["EXPIRED"] = "expired";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
var VerificationPriority;
(function (VerificationPriority) {
    VerificationPriority["LOW"] = "low";
    VerificationPriority["MEDIUM"] = "medium";
    VerificationPriority["HIGH"] = "high";
    VerificationPriority["URGENT"] = "urgent";
})(VerificationPriority || (exports.VerificationPriority = VerificationPriority = {}));
let Verification = class Verification {
};
exports.Verification = Verification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Verification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Verification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Verification.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], Verification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'verification_type',
        type: 'enum',
        enum: VerificationType,
    }),
    __metadata("design:type", String)
], Verification.prototype, "verificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VerificationStatus,
        default: VerificationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Verification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_broker_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Verification.prototype, "assignedBrokerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_broker_id' }),
    __metadata("design:type", Object)
], Verification.prototype, "assignedBroker", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Verification.prototype, "assignedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VerificationPriority,
        default: VerificationPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], Verification.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Verification.prototype, "checklist", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejection_reason', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Verification.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejection_details', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Verification.prototype, "rejectionDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Verification.prototype, "completedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Verification.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Verification.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Verification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Verification.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Verification.prototype, "expiresAt", void 0);
exports.Verification = Verification = __decorate([
    (0, typeorm_1.Entity)('verifications'),
    (0, typeorm_1.Index)('idx_verifications_status', ['status']),
    (0, typeorm_1.Index)('idx_verifications_broker', ['assignedBrokerId']),
    (0, typeorm_1.Index)('idx_verifications_user', ['userId']),
    (0, typeorm_1.Index)('idx_verifications_property', ['propertyId']),
    (0, typeorm_1.Index)('idx_verifications_priority', ['priority'])
], Verification);
//# sourceMappingURL=verification.entity.js.map