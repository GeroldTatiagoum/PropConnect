import { User } from '../../modules/users/entities/user.entity';
export declare enum AuditStatus {
    SUCCESS = "success",
    FAILURE = "failure"
}
export declare class AuditLog {
    id: string;
    actorId: string;
    actor: User;
    action: string;
    entityType: string | null;
    entityId: string | null;
    oldValues: Record<string, unknown> | null;
    newValues: Record<string, unknown> | null;
    ipAddress: string | null;
    userAgent: string | null;
    status: AuditStatus;
    errorMessage: string | null;
    createdAt: Date;
}
//# sourceMappingURL=audit-log.entity.d.ts.map