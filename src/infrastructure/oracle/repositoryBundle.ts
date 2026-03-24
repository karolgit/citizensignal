import type { Pool } from "oracledb";

import type {
  AudienceRecordDocument,
  AudienceSegmentDocument,
  AuditEventDocument,
  DistrictDocument,
  PrivilegeGroupDocument,
  SegmentDefinitionDocument,
  SourceDocument,
  UserDocument,
} from "../../admin/types.js";
import type {
  AudienceRecordRepository,
  AudienceSegmentRepository,
  AuditEventRepository,
  DistrictRepository,
  PrivilegeGroupRepository,
  RepositoryBundle,
  SegmentDefinitionRepository,
  SourceRepository,
  UserRepository,
} from "../../admin/repositories.js";
import { OracleJsonDocumentRepository } from "./jsonDocumentRepository.js";

class OracleDistrictRepository
  extends OracleJsonDocumentRepository<DistrictDocument>
  implements DistrictRepository
{
  constructor(pool: Pool) {
    super(pool, "cs_district_documents");
  }

  save(district: DistrictDocument): Promise<void> {
    return super.save(district.districtId, district);
  }
}

class OracleSourceRepository
  extends OracleJsonDocumentRepository<SourceDocument>
  implements SourceRepository
{
  constructor(pool: Pool) {
    super(pool, "cs_source_documents");
  }

  async findByDistrictId(districtId: string): Promise<SourceDocument[]> {
    const result = await this.execute<{ PAYLOAD: unknown }>(
      `select payload as "PAYLOAD"
       from ${this.tableName}
       where json_exists(
         payload,
         '$.districtIds[*]?(@ == $districtId)'
         passing :district_id as "districtId"
       )
       order by created_at asc`,
      { district_id: districtId },
    );

    return (result.rows ?? []).map((row) => this.toDocument(row.PAYLOAD));
  }

  save(source: SourceDocument): Promise<void> {
    return super.save(source.sourceId, source);
  }
}

class OracleSegmentDefinitionRepository
  extends OracleJsonDocumentRepository<SegmentDefinitionDocument>
  implements SegmentDefinitionRepository
{
  constructor(pool: Pool) {
    super(pool, "cs_segment_definition_documents");
  }

  async getByDimensionKey(
    dimensionKey: string,
  ): Promise<SegmentDefinitionDocument | undefined> {
    const result = await this.execute<{ PAYLOAD: unknown }>(
      `select payload as "PAYLOAD"
       from ${this.tableName}
       where json_value(payload, '$.dimensionKey' returning varchar2(128)) = :dimension_key
       fetch first 1 row only`,
      { dimension_key: dimensionKey },
    );

    const row = result.rows?.[0];
    return row ? this.toDocument(row.PAYLOAD) : undefined;
  }

  save(document: SegmentDefinitionDocument): Promise<void> {
    return super.save(document.segmentDefinitionId, document);
  }
}

class OracleAudienceSegmentRepository
  extends OracleJsonDocumentRepository<AudienceSegmentDocument>
  implements AudienceSegmentRepository
{
  constructor(pool: Pool) {
    super(pool, "cs_audience_segment_documents");
  }

  async findByDimensionKey(dimensionKey: string): Promise<AudienceSegmentDocument[]> {
    const result = await this.execute<{ PAYLOAD: unknown }>(
      `select payload as "PAYLOAD"
       from ${this.tableName}
       where json_exists(
         payload,
         '$.filters.criteria[*]?(@.dimensionKey == $dimensionKey)'
         passing :dimension_key as "dimensionKey"
       )
       order by created_at asc`,
      { dimension_key: dimensionKey },
    );

    return (result.rows ?? []).map((row) => this.toDocument(row.PAYLOAD));
  }

  save(document: AudienceSegmentDocument): Promise<void> {
    return super.save(document.segmentId, document);
  }
}

class OracleAudienceRecordRepository
  extends OracleJsonDocumentRepository<AudienceRecordDocument>
  implements AudienceRecordRepository
{
  constructor(pool: Pool) {
    super(pool, "cs_audience_record_documents");
  }

  save(document: AudienceRecordDocument): Promise<void> {
    return super.save(document.audienceRecordId, document);
  }
}

class OracleUserRepository
  extends OracleJsonDocumentRepository<UserDocument>
  implements UserRepository
{
  constructor(pool: Pool) {
    super(pool, "cs_user_documents");
  }

  async findByEmail(email: string): Promise<UserDocument | undefined> {
    const result = await this.execute<{ PAYLOAD: unknown }>(
      `select payload as "PAYLOAD"
       from ${this.tableName}
       where lower(json_value(payload, '$.email' returning varchar2(320))) = lower(:email)
       fetch first 1 row only`,
      { email },
    );

    const row = result.rows?.[0];
    return row ? this.toDocument(row.PAYLOAD) : undefined;
  }

  save(user: UserDocument): Promise<void> {
    return super.save(user.userId, user);
  }
}

class OraclePrivilegeGroupRepository
  extends OracleJsonDocumentRepository<PrivilegeGroupDocument>
  implements PrivilegeGroupRepository
{
  constructor(pool: Pool) {
    super(pool, "cs_privilege_group_documents");
  }

  save(group: PrivilegeGroupDocument): Promise<void> {
    return super.save(group.privilegeGroupId, group);
  }
}

class OracleAuditEventRepository
  extends OracleJsonDocumentRepository<AuditEventDocument>
  implements AuditEventRepository
{
  constructor(pool: Pool) {
    super(pool, "cs_audit_event_documents");
  }

  save(event: AuditEventDocument): Promise<void> {
    return super.save(event.auditEventId, event);
  }
}

export function createOracleRepositoryBundle(pool: Pool): RepositoryBundle {
  return {
    districts: new OracleDistrictRepository(pool),
    sources: new OracleSourceRepository(pool),
    segmentDefinitions: new OracleSegmentDefinitionRepository(pool),
    audienceSegments: new OracleAudienceSegmentRepository(pool),
    audienceRecords: new OracleAudienceRecordRepository(pool),
    users: new OracleUserRepository(pool),
    privilegeGroups: new OraclePrivilegeGroupRepository(pool),
    auditEvents: new OracleAuditEventRepository(pool),
  };
}

