import { randomUUID } from "node:crypto";

import type { AuditEventRepository } from "./repositories.js";
import type { AuditEventDocument, AuditTargetType, UserDocument } from "./types.js";
import { validateAuditEvent } from "./validation.js";

export function createId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

export function nowAsIsoString(): string {
  return new Date().toISOString();
}

export class AuditService {
  constructor(private readonly auditEvents: AuditEventRepository) {}

  async record(params: {
    actor: UserDocument;
    action: string;
    targetType: AuditTargetType;
    targetId: string;
    districtId?: string;
    details: Record<string, unknown>;
  }): Promise<AuditEventDocument> {
    const baseEvent = {
      auditEventId: createId("audit"),
      actorType: "user",
      actorId: params.actor.userId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      timestamp: nowAsIsoString(),
      details: params.details,
    };
    const event: AuditEventDocument = params.districtId
      ? {
          ...baseEvent,
          districtId: params.districtId,
        }
      : baseEvent;

    validateAuditEvent(event);
    await this.auditEvents.save(event);
    return event;
  }
}
