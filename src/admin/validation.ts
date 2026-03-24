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

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function assertNonEmptyString(value: string, fieldName: string): void {
  if (!value.trim()) {
    throw new ValidationError(`${fieldName} must be a non-empty string.`);
  }
}

function assertArrayHasValues<T>(
  values: T[],
  fieldName: string,
  minimum = 1,
): void {
  if (values.length < minimum) {
    throw new ValidationError(`${fieldName} must contain at least ${minimum} value(s).`);
  }
}

function assertUniqueStrings(values: string[], fieldName: string): void {
  if (new Set(values).size !== values.length) {
    throw new ValidationError(`${fieldName} must not contain duplicate values.`);
  }
}

function assertUrl(value: string, fieldName: string): void {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new ValidationError(`${fieldName} must use http or https.`);
    }
  } catch {
    throw new ValidationError(`${fieldName} must be a valid URL.`);
  }
}

export function validateDistrict(document: DistrictDocument): void {
  assertNonEmptyString(document.districtId, "districtId");
  assertNonEmptyString(document.state, "state");
  assertNonEmptyString(document.officeType, "officeType");
  assertNonEmptyString(document.districtName, "districtName");
  assertArrayHasValues(document.municipalities, "municipalities");
  assertArrayHasValues(document.zipCodes, "zipCodes");
}

export function validateSource(document: SourceDocument): void {
  assertNonEmptyString(document.sourceId, "sourceId");
  assertNonEmptyString(document.name, "name");
  assertUrl(document.url, "url");
  assertArrayHasValues(document.districtIds, "districtIds");
  assertArrayHasValues(document.coverage.districts, "coverage.districts");

  if (document.trustScore !== undefined && (document.trustScore < 0 || document.trustScore > 1)) {
    throw new ValidationError("trustScore must be between 0 and 1.");
  }

  if (
    document.confidenceScore !== undefined &&
    (document.confidenceScore < 0 || document.confidenceScore > 1)
  ) {
    throw new ValidationError("confidenceScore must be between 0 and 1.");
  }
}

export function validateSegmentDefinition(document: SegmentDefinitionDocument): void {
  assertNonEmptyString(document.segmentDefinitionId, "segmentDefinitionId");
  assertNonEmptyString(document.dimensionKey, "dimensionKey");
  assertNonEmptyString(document.name, "name");
  assertArrayHasValues(document.values, "values");
  assertUniqueStrings(
    document.values.map((value) => value.valueId),
    "values.valueId",
  );
  assertUniqueStrings(
    document.values.map((value) => value.key),
    "values.key",
  );
}

export function validateAudienceSegment(document: AudienceSegmentDocument): void {
  assertNonEmptyString(document.segmentId, "segmentId");
  assertNonEmptyString(document.districtId, "districtId");
  assertNonEmptyString(document.name, "name");
  assertArrayHasValues(document.filters.criteria, "filters.criteria");

  for (const criterion of document.filters.criteria) {
    assertNonEmptyString(criterion.dimensionKey, "filters.criteria.dimensionKey");
    assertArrayHasValues(criterion.valueIds, "filters.criteria.valueIds");
  }
}

export function validateAudienceRecord(document: AudienceRecordDocument): void {
  assertNonEmptyString(document.audienceRecordId, "audienceRecordId");
  assertNonEmptyString(document.fullName, "fullName");
  assertNonEmptyString(document.municipality, "municipality");
  assertNonEmptyString(document.zipCode, "zipCode");
}

export function validateUser(document: UserDocument): void {
  assertNonEmptyString(document.userId, "userId");
  assertNonEmptyString(document.name, "name");
  assertNonEmptyString(document.email, "email");
  assertArrayHasValues(document.privilegeGroupIds, "privilegeGroupIds");
}

export function validatePrivilegeGroup(document: PrivilegeGroupDocument): void {
  assertNonEmptyString(document.privilegeGroupId, "privilegeGroupId");
  assertNonEmptyString(document.name, "name");
  assertUniqueStrings(document.permissions, "permissions");
}

export function validateAuditEvent(document: AuditEventDocument): void {
  assertNonEmptyString(document.auditEventId, "auditEventId");
  assertNonEmptyString(document.actorId, "actorId");
  assertNonEmptyString(document.action, "action");
  assertNonEmptyString(document.targetId, "targetId");
}
