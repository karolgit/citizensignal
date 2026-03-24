import { AuditService, createId, nowAsIsoString } from "./audit.js";
import { AuthorizationError, hasPermission } from "./permissions.js";
import type { RepositoryBundle } from "./repositories.js";
import type {
  PermissionKey,
  PrivilegeGroupDocument,
  SegmentDefinitionDocument,
  SegmentDefinitionUpdateResult,
  SourceDocument,
  UserDocument,
} from "./types.js";
import {
  validateSegmentDefinition,
  validateSource,
  validateUser,
} from "./validation.js";

class AuthorizationService {
  constructor(private readonly repositories: RepositoryBundle) {}

  async ensurePermission(actor: UserDocument, permission: PermissionKey): Promise<void> {
    const privilegeGroups = await Promise.all(
      actor.privilegeGroupIds.map(async (groupId) =>
        this.repositories.privilegeGroups.getById(groupId),
      ),
    );

    const hydratedPrivilegeGroups = privilegeGroups.filter(
      (group): group is PrivilegeGroupDocument => group !== undefined,
    );

    if (!hasPermission(actor, hydratedPrivilegeGroups, permission)) {
      throw new AuthorizationError(
        `User ${actor.userId} does not have permission ${permission}.`,
      );
    }
  }
}

export class UserAdministrationService {
  private readonly authorization: AuthorizationService;
  private readonly audit: AuditService;

  constructor(private readonly repositories: RepositoryBundle) {
    this.authorization = new AuthorizationService(repositories);
    this.audit = new AuditService(repositories.auditEvents);
  }

  async createUser(
    actor: UserDocument,
    input: {
      name: string;
      email: string;
      districtIds: string[];
      privilegeGroupIds: string[];
      timezone: string;
    },
  ): Promise<UserDocument> {
    await this.authorization.ensurePermission(actor, "user_administration.manage");

    const existingUser = await this.repositories.users.findByEmail(input.email);
    if (existingUser) {
      throw new Error(`A user already exists for email ${input.email}.`);
    }

    await this.assertPrivilegeGroupsExist(input.privilegeGroupIds);

    const now = nowAsIsoString();
    const user: UserDocument = {
      userId: createId("user"),
      name: input.name,
      email: input.email,
      status: "active",
      districtIds: input.districtIds,
      privilegeGroupIds: input.privilegeGroupIds,
      preferences: {
        timezone: input.timezone,
      },
      createdAt: now,
      updatedAt: now,
    };

    validateUser(user);
    await this.repositories.users.save(user);
    await this.audit.record({
      actor,
      action: "user.created",
      targetType: "user",
      targetId: user.userId,
      details: {
        email: user.email,
        privilegeGroupIds: user.privilegeGroupIds,
      },
    });

    return user;
  }

  async updateUser(
    actor: UserDocument,
    userId: string,
    updates: Partial<Pick<UserDocument, "name" | "districtIds" | "preferences">>,
  ): Promise<UserDocument> {
    await this.authorization.ensurePermission(actor, "user_administration.manage");

    const existingUser = await this.requireUser(userId);
    const updatedUser: UserDocument = {
      ...existingUser,
      ...updates,
      updatedAt: nowAsIsoString(),
    };

    validateUser(updatedUser);
    await this.repositories.users.save(updatedUser);
    await this.audit.record({
      actor,
      action: "user.updated",
      targetType: "user",
      targetId: updatedUser.userId,
      details: {
        updatedFields: Object.keys(updates),
      },
    });

    return updatedUser;
  }

  async changeUserStatus(
    actor: UserDocument,
    userId: string,
    status: UserDocument["status"],
  ): Promise<UserDocument> {
    await this.authorization.ensurePermission(actor, "user_administration.manage");

    const existingUser = await this.requireUser(userId);
    const updatedUser: UserDocument = {
      ...existingUser,
      status,
      updatedAt: nowAsIsoString(),
    };

    validateUser(updatedUser);
    await this.repositories.users.save(updatedUser);
    await this.audit.record({
      actor,
      action: "user.status.changed",
      targetType: "user",
      targetId: updatedUser.userId,
      details: {
        status,
      },
    });

    return updatedUser;
  }

  async assignPrivilegeGroups(
    actor: UserDocument,
    userId: string,
    privilegeGroupIds: string[],
  ): Promise<UserDocument> {
    await this.authorization.ensurePermission(actor, "user_administration.manage");
    await this.assertPrivilegeGroupsExist(privilegeGroupIds);

    const existingUser = await this.requireUser(userId);
    const updatedUser: UserDocument = {
      ...existingUser,
      privilegeGroupIds,
      updatedAt: nowAsIsoString(),
    };

    validateUser(updatedUser);
    await this.repositories.users.save(updatedUser);
    await this.audit.record({
      actor,
      action: "user.privilege-groups.updated",
      targetType: "user",
      targetId: updatedUser.userId,
      details: {
        privilegeGroupIds,
      },
    });

    return updatedUser;
  }

  private async assertPrivilegeGroupsExist(privilegeGroupIds: string[]): Promise<void> {
    const groups = await Promise.all(
      privilegeGroupIds.map((groupId) => this.repositories.privilegeGroups.getById(groupId)),
    );

    const missingGroup = groups.findIndex((group) => group === undefined);
    if (missingGroup >= 0) {
      throw new Error(`Unknown privilege group ${privilegeGroupIds[missingGroup]}.`);
    }
  }

  private async requireUser(userId: string): Promise<UserDocument> {
    const user = await this.repositories.users.getById(userId);
    if (!user) {
      throw new Error(`User ${userId} was not found.`);
    }

    return user;
  }
}

export class SegmentDefinitionService {
  private readonly authorization: AuthorizationService;
  private readonly audit: AuditService;

  constructor(private readonly repositories: RepositoryBundle) {
    this.authorization = new AuthorizationService(repositories);
    this.audit = new AuditService(repositories.auditEvents);
  }

  async createDefinition(
    actor: UserDocument,
    input: Omit<
      SegmentDefinitionDocument,
      "segmentDefinitionId" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
    >,
  ): Promise<SegmentDefinitionDocument> {
    await this.authorization.ensurePermission(actor, "segment_definition.manage");

    const existingDefinition = await this.repositories.segmentDefinitions.getByDimensionKey(
      input.dimensionKey,
    );
    if (existingDefinition) {
      throw new Error(`Segment definition ${input.dimensionKey} already exists.`);
    }

    const now = nowAsIsoString();
    const definition: SegmentDefinitionDocument = {
      ...input,
      segmentDefinitionId: createId("segment_definition"),
      createdBy: actor.userId,
      updatedBy: actor.userId,
      createdAt: now,
      updatedAt: now,
    };

    validateSegmentDefinition(definition);
    await this.repositories.segmentDefinitions.save(definition);
    await this.audit.record({
      actor,
      action: "segment-definition.created",
      targetType: "segment_definition",
      targetId: definition.segmentDefinitionId,
      details: {
        dimensionKey: definition.dimensionKey,
        valueCount: definition.values.length,
      },
    });

    return definition;
  }

  async updateDefinition(
    actor: UserDocument,
    segmentDefinitionId: string,
    updates: Partial<
      Pick<
        SegmentDefinitionDocument,
        | "name"
        | "description"
        | "values"
        | "displayOrder"
        | "status"
        | "effectiveFrom"
        | "effectiveTo"
      >
    >,
  ): Promise<SegmentDefinitionUpdateResult> {
    await this.authorization.ensurePermission(actor, "segment_definition.manage");

    const existingDefinition = await this.requireDefinition(segmentDefinitionId);
    const updatedDefinition: SegmentDefinitionDocument = {
      ...existingDefinition,
      ...updates,
      updatedBy: actor.userId,
      updatedAt: nowAsIsoString(),
    };

    validateSegmentDefinition(updatedDefinition);
    const impactedSegmentIds = await this.findImpactedSegments(
      existingDefinition,
      updatedDefinition,
    );

    await this.repositories.segmentDefinitions.save(updatedDefinition);
    await this.audit.record({
      actor,
      action: "segment-definition.updated",
      targetType: "segment_definition",
      targetId: updatedDefinition.segmentDefinitionId,
      details: {
        dimensionKey: updatedDefinition.dimensionKey,
        impactedSegmentIds,
      },
    });

    return {
      definition: updatedDefinition,
      impactedSegmentIds,
    };
  }

  async changeDefinitionStatus(
    actor: UserDocument,
    segmentDefinitionId: string,
    status: SegmentDefinitionDocument["status"],
  ): Promise<SegmentDefinitionUpdateResult> {
    return this.updateDefinition(actor, segmentDefinitionId, { status });
  }

  private async findImpactedSegments(
    previousDefinition: SegmentDefinitionDocument,
    nextDefinition: SegmentDefinitionDocument,
  ): Promise<string[]> {
    const previousActiveValues = new Set(
      previousDefinition.values
        .filter((value) => value.status === "active")
        .map((value) => value.valueId),
    );
    const nextActiveValues = new Set(
      nextDefinition.values
        .filter((value) => value.status === "active")
        .map((value) => value.valueId),
    );

    const retiredValueIds = Array.from(previousActiveValues).filter(
      (valueId) => !nextActiveValues.has(valueId),
    );
    if (retiredValueIds.length === 0) {
      return [];
    }

    const savedSegments = await this.repositories.audienceSegments.findByDimensionKey(
      nextDefinition.dimensionKey,
    );

    return savedSegments
      .filter((segment) =>
        segment.filters.criteria.some(
          (criterion) =>
            criterion.dimensionKey === nextDefinition.dimensionKey &&
            criterion.valueIds.some((valueId) => retiredValueIds.includes(valueId)),
        ),
      )
      .map((segment) => segment.segmentId);
  }

  private async requireDefinition(
    segmentDefinitionId: string,
  ): Promise<SegmentDefinitionDocument> {
    const definition =
      await this.repositories.segmentDefinitions.getById(segmentDefinitionId);
    if (!definition) {
      throw new Error(`Segment definition ${segmentDefinitionId} was not found.`);
    }

    return definition;
  }
}

export class SourceAdministrationService {
  private readonly authorization: AuthorizationService;
  private readonly audit: AuditService;

  constructor(private readonly repositories: RepositoryBundle) {
    this.authorization = new AuthorizationService(repositories);
    this.audit = new AuditService(repositories.auditEvents);
  }

  async registerSource(
    actor: UserDocument,
    input: Omit<SourceDocument, "sourceId" | "createdAt" | "updatedAt">,
  ): Promise<SourceDocument> {
    await this.authorization.ensurePermission(actor, "source_registry.manage");

    const now = nowAsIsoString();
    const source: SourceDocument = {
      ...input,
      sourceId: createId("source"),
      createdAt: now,
      updatedAt: now,
    };

    validateSource(source);
    await this.repositories.sources.save(source);
    const primaryDistrictId = source.districtIds[0];
    await this.audit.record({
      actor,
      action: "source.created",
      targetType: "source",
      targetId: source.sourceId,
      ...(primaryDistrictId ? { districtId: primaryDistrictId } : {}),
      details: {
        sourceType: source.sourceType,
        platform: source.platform,
      },
    });

    return source;
  }

  async updateSourceClassification(
    actor: UserDocument,
    sourceId: string,
    updates: Partial<
      Pick<
        SourceDocument,
        | "politicalLeaning"
        | "framingTendency"
        | "trustScore"
        | "confidenceScore"
        | "tags"
        | "isActive"
        | "coverage"
      >
    >,
  ): Promise<SourceDocument> {
    await this.authorization.ensurePermission(actor, "source_registry.manage");

    const existingSource = await this.requireSource(sourceId);
    const updatedSource: SourceDocument = {
      ...existingSource,
      ...updates,
      updatedAt: nowAsIsoString(),
    };

    validateSource(updatedSource);
    await this.repositories.sources.save(updatedSource);
    const primaryDistrictId = updatedSource.districtIds[0];
    await this.audit.record({
      actor,
      action: "source.classification.updated",
      targetType: "source",
      targetId: updatedSource.sourceId,
      ...(primaryDistrictId ? { districtId: primaryDistrictId } : {}),
      details: {
        updatedFields: Object.keys(updates),
      },
    });

    return updatedSource;
  }

  private async requireSource(sourceId: string): Promise<SourceDocument> {
    const source = await this.repositories.sources.getById(sourceId);
    if (!source) {
      throw new Error(`Source ${sourceId} was not found.`);
    }

    return source;
  }
}
