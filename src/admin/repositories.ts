import type {
  AudienceRecordDocument,
  AudienceSegmentDocument,
  AuditEventDocument,
  DistrictDocument,
  PrivilegeGroupDocument,
  SegmentDefinitionDocument,
  SourceDocument,
  UserDocument,
} from "./types.js";

export interface DistrictRepository {
  getById(districtId: string): Promise<DistrictDocument | undefined>;
  list(): Promise<DistrictDocument[]>;
  save(district: DistrictDocument): Promise<void>;
}

export interface SourceRepository {
  getById(sourceId: string): Promise<SourceDocument | undefined>;
  findByDistrictId(districtId: string): Promise<SourceDocument[]>;
  list(): Promise<SourceDocument[]>;
  save(source: SourceDocument): Promise<void>;
}

export interface SegmentDefinitionRepository {
  getById(segmentDefinitionId: string): Promise<SegmentDefinitionDocument | undefined>;
  getByDimensionKey(dimensionKey: string): Promise<SegmentDefinitionDocument | undefined>;
  list(): Promise<SegmentDefinitionDocument[]>;
  save(document: SegmentDefinitionDocument): Promise<void>;
}

export interface AudienceSegmentRepository {
  getById(segmentId: string): Promise<AudienceSegmentDocument | undefined>;
  findByDimensionKey(dimensionKey: string): Promise<AudienceSegmentDocument[]>;
  list(): Promise<AudienceSegmentDocument[]>;
  save(document: AudienceSegmentDocument): Promise<void>;
}

export interface AudienceRecordRepository {
  getById(audienceRecordId: string): Promise<AudienceRecordDocument | undefined>;
  list(): Promise<AudienceRecordDocument[]>;
  save(document: AudienceRecordDocument): Promise<void>;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserDocument | undefined>;
  getById(userId: string): Promise<UserDocument | undefined>;
  list(): Promise<UserDocument[]>;
  save(user: UserDocument): Promise<void>;
}

export interface PrivilegeGroupRepository {
  getById(privilegeGroupId: string): Promise<PrivilegeGroupDocument | undefined>;
  list(): Promise<PrivilegeGroupDocument[]>;
  save(group: PrivilegeGroupDocument): Promise<void>;
}

export interface AuditEventRepository {
  list(): Promise<AuditEventDocument[]>;
  save(event: AuditEventDocument): Promise<void>;
}

export interface RepositoryBundle {
  districts: DistrictRepository;
  sources: SourceRepository;
  segmentDefinitions: SegmentDefinitionRepository;
  audienceSegments: AudienceSegmentRepository;
  audienceRecords: AudienceRecordRepository;
  users: UserRepository;
  privilegeGroups: PrivilegeGroupRepository;
  auditEvents: AuditEventRepository;
}
