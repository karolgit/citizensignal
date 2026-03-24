export type ISODateString = string;

export type RecordStatus = "active" | "inactive" | "archived";
export type UserStatus = "active" | "inactive";
export type AuditActorType = "user" | "system";
export type AuditTargetType =
  | "district"
  | "source"
  | "audience_segment"
  | "segment_definition"
  | "audience_record"
  | "user"
  | "privilege_group";

export type SourceType =
  | "local_newspaper"
  | "regional_newspaper"
  | "town_newsletter"
  | "municipal_records"
  | "community_discussion";

export type SourcePlatform =
  | "web"
  | "facebook"
  | "newsletter"
  | "municipal"
  | "print"
  | "mixed";

export type PermissionKey =
  | "district.manage"
  | "source_registry.manage"
  | "segment_definition.manage"
  | "audience_records.manage"
  | "user_administration.manage";

export interface DistrictDocument {
  districtId: string;
  state: string;
  officeType: string;
  districtName: string;
  districtNumber: string;
  municipalities: string[];
  zipCodes: string[];
  neighborhoods: string[];
  notes: string;
  status: RecordStatus;
  createdBy: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SourceCoverage {
  municipalities: string[];
  zipCodes: string[];
  districts: string[];
}

export interface SourceDocument {
  sourceId: string;
  districtIds: string[];
  name: string;
  sourceType: SourceType;
  url: string;
  platform: SourcePlatform;
  coverage: SourceCoverage;
  politicalLeaning?: string;
  framingTendency?: string;
  trustScore?: number;
  confidenceScore?: number;
  updateFrequency?: string;
  ingestionMethod?: string;
  isActive: boolean;
  tags: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SegmentDefinitionValue {
  valueId: string;
  key: string;
  label: string;
  description?: string;
  displayOrder: number;
  status: RecordStatus;
}

export interface SegmentDefinitionDocument {
  segmentDefinitionId: string;
  dimensionKey: string;
  name: string;
  description: string;
  values: SegmentDefinitionValue[];
  valueType: "single_select" | "multi_select";
  displayOrder: number;
  status: RecordStatus;
  effectiveFrom?: ISODateString;
  effectiveTo?: ISODateString;
  createdBy: string;
  updatedBy: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SegmentFilterCriterion {
  dimensionKey: string;
  operator: "in" | "not_in";
  valueIds: string[];
}

export interface AudienceSegmentDocument {
  segmentId: string;
  districtId: string;
  name: string;
  description: string;
  filters: {
    criteria: SegmentFilterCriterion[];
  };
  tags: string[];
  estimatedAudienceSize?: number;
  createdBy: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  isArchived: boolean;
}

export interface AudienceRecordDocument {
  audienceRecordId: string;
  districtIds: string[];
  fullName: string;
  municipality: string;
  zipCode: string;
  ageGroup?: string;
  incomeGroup?: string;
  politicalViewpoint?: string;
  sexOrGender?: string;
  occupationGroup?: string;
  issueInterests: string[];
  engagementLevel?: string;
  campaignTags: string[];
  contactChannels: string[];
  consent: {
    canEmail: boolean;
    canText: boolean;
  };
  sourceSystem: string;
  segmentIds: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UserDocument {
  userId: string;
  name: string;
  email: string;
  status: UserStatus;
  districtIds: string[];
  privilegeGroupIds: string[];
  preferences: {
    timezone: string;
  };
  lastLoginAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PrivilegeGroupDocument {
  privilegeGroupId: string;
  name: string;
  description: string;
  permissions: PermissionKey[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface AuditEventDocument {
  auditEventId: string;
  actorType: AuditActorType;
  actorId: string;
  action: string;
  targetType: AuditTargetType;
  targetId: string;
  districtId?: string;
  timestamp: ISODateString;
  details: Record<string, unknown>;
}

export interface SegmentDefinitionUpdateResult {
  definition: SegmentDefinitionDocument;
  impactedSegmentIds: string[];
}
