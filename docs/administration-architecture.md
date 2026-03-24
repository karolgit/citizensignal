# Administration Architecture

This document describes the TypeScript administration foundation added for CitizenSignal's MVP. The design follows the PRD's JSON-document approach so it can evolve into Oracle Autonomous AI JSON Database later without reshaping the domain model.

## Architecture Summary

The implementation is organized into four layers:

- `src/admin/types.ts`: JSON-document domain types for districts, sources, segment definitions, audience segments, audience records, users, privilege groups, and audit events.
- `src/admin/validation.ts`: hand-written validation rules for each document type.
- `src/admin/repositories.ts` and `src/admin/inMemoryRepositories.ts`: repository contracts plus in-memory implementations used for local development and testing.
- `src/admin/services.ts`: administrator workflows for user management, privilege assignment, segment-definition management, source registration, and source classification.

This keeps the domain logic independent from any future API framework, ORM, or OCI SDK integration.

## Validation Strategy

Validation is intentionally explicit and dependency-light:

- required identifiers and names must be non-empty
- document arrays that define ownership or configuration must not be empty where required
- URL fields are validated as `http` or `https`
- `trustScore` and `confidenceScore` are constrained to `0..1`
- privilege-group permissions and segment-definition values must be unique
- audience segments must define at least one filter criterion

This can later be swapped to a schema library such as Zod or Ajv without changing the service layer.

## Permission Model

Named privilege groups aggregate reusable permissions rather than storing per-user flags. The current screen and workflow permission keys are:

- `district.manage`
- `source_registry.manage`
- `segment_definition.manage`
- `audience_records.manage`
- `user_administration.manage`

`AuthorizationService` resolves a user's privilege groups and checks whether the requested operation is allowed. Inactive users are denied automatically.

## Audit Model

Administrative actions write `audit_event` documents through `AuditService`. The current implementation records:

- `user.created`
- `user.updated`
- `user.status.changed`
- `user.privilege-groups.updated`
- `segment-definition.created`
- `segment-definition.updated`
- `source.created`
- `source.classification.updated`

Audit payloads are structured so downstream logging, review, or export can happen without parsing free text.

## Document Model

### `district`

Purpose:
Defines the political geography and workspace boundary for analysis and administration.

Repository:
`DistrictRepository`

Recommended indexes:

- `districtId`
- `state`
- `officeType`
- `status`

Example JSON:

```json
{
  "districtId": "district_me_house_34",
  "state": "Maine",
  "officeType": "State House",
  "districtName": "Maine House District 34",
  "districtNumber": "34",
  "municipalities": ["Arundel", "Kennebunk", "Kennebunkport"],
  "zipCodes": ["04043", "04046"],
  "neighborhoods": [],
  "notes": "Seed district used for administration examples.",
  "status": "active",
  "createdBy": "system",
  "createdAt": "2026-03-24T12:00:00.000Z",
  "updatedAt": "2026-03-24T12:00:00.000Z"
}
```

### `source`

Purpose:
Stores curated district-relevant source metadata and classification fields.

Repository:
`SourceRepository`

Recommended indexes:

- `sourceId`
- `districtIds`
- `sourceType`
- `coverage.districts`
- `isActive`
- `tags`

Example JSON:

```json
{
  "sourceId": "source_kennebunk_post",
  "districtIds": ["district_me_house_34"],
  "name": "Kennebunk Post",
  "sourceType": "local_newspaper",
  "url": "https://example.com/kennebunk-post",
  "platform": "web",
  "coverage": {
    "municipalities": ["Kennebunk", "Kennebunkport"],
    "zipCodes": ["04043", "04046"],
    "districts": ["district_me_house_34"]
  },
  "politicalLeaning": "local_general",
  "framingTendency": "community-reporting",
  "trustScore": 0.82,
  "confidenceScore": 0.78,
  "updateFrequency": "weekly",
  "ingestionMethod": "manual_registry",
  "isActive": true,
  "tags": ["hyperlocal", "district-34"],
  "createdAt": "2026-03-24T12:00:00.000Z",
  "updatedAt": "2026-03-24T12:00:00.000Z"
}
```

### `audience_segment`

Purpose:
Stores saved targeting definitions that depend on administrator-managed segment values.

Repository:
`AudienceSegmentRepository`

Recommended indexes:

- `segmentId`
- `districtId`
- `filters.criteria.dimensionKey`
- `isArchived`

Example JSON:

```json
{
  "segmentId": "aud_segment_teachers",
  "districtId": "district_me_house_34",
  "name": "District Teachers",
  "description": "Saved segment for teachers in Maine House District 34.",
  "filters": {
    "criteria": [
      {
        "dimensionKey": "occupation_group",
        "operator": "in",
        "valueIds": ["occupation_teacher"]
      }
    ]
  },
  "tags": ["education", "community-leaders"],
  "estimatedAudienceSize": 180,
  "createdBy": "user_admin_1",
  "createdAt": "2026-03-24T12:00:00.000Z",
  "updatedAt": "2026-03-24T12:00:00.000Z",
  "isArchived": false
}
```

### `segment_definition`

Purpose:
Stores administrator-managed dimensions and allowed values used by analysis and targeting.

Repository:
`SegmentDefinitionRepository`

Recommended indexes:

- `segmentDefinitionId`
- `dimensionKey`
- `status`
- `values.valueId`
- `values.status`

Example JSON:

```json
{
  "segmentDefinitionId": "segment_def_occupation_group",
  "dimensionKey": "occupation_group",
  "name": "Occupation Group",
  "description": "Administrator-managed occupation classifications.",
  "values": [
    {
      "valueId": "occupation_teacher",
      "key": "teacher",
      "label": "Teacher",
      "displayOrder": 4,
      "status": "active"
    }
  ],
  "valueType": "single_select",
  "displayOrder": 5,
  "status": "active",
  "createdBy": "user_admin_1",
  "updatedBy": "user_admin_1",
  "createdAt": "2026-03-24T12:00:00.000Z",
  "updatedAt": "2026-03-24T12:00:00.000Z"
}
```

### `audience_record`

Purpose:
Stores lightweight constituent records that can be associated with normalized segment values.

Repository:
`AudienceRecordRepository`

Recommended indexes:

- `audienceRecordId`
- `districtIds`
- `municipality`
- `zipCode`
- `segmentIds`

Example JSON:

```json
{
  "audienceRecordId": "aud_record_1",
  "districtIds": ["district_me_house_34"],
  "fullName": "Jordan Sample",
  "municipality": "Kennebunk",
  "zipCode": "04043",
  "occupationGroup": "occupation_teacher",
  "issueInterests": ["schools", "property_taxes"],
  "campaignTags": ["volunteer"],
  "contactChannels": ["email"],
  "consent": {
    "canEmail": true,
    "canText": false
  },
  "sourceSystem": "seed",
  "segmentIds": ["aud_segment_teachers"],
  "createdAt": "2026-03-24T12:00:00.000Z",
  "updatedAt": "2026-03-24T12:00:00.000Z"
}
```

### `user`

Purpose:
Stores application users plus their assigned privilege groups and district scope.

Repository:
`UserRepository`

Recommended indexes:

- `userId`
- `email`
- `status`
- `districtIds`
- `privilegeGroupIds`

Example JSON:

```json
{
  "userId": "user_admin_1",
  "name": "Admin User",
  "email": "admin@citizensignal.local",
  "status": "active",
  "districtIds": ["district_me_house_34"],
  "privilegeGroupIds": ["pg_platform_admin"],
  "preferences": {
    "timezone": "America/New_York"
  },
  "createdAt": "2026-03-24T12:00:00.000Z",
  "updatedAt": "2026-03-24T12:00:00.000Z"
}
```

### `privilege_group`

Purpose:
Stores reusable named permission bundles.

Repository:
`PrivilegeGroupRepository`

Recommended indexes:

- `privilegeGroupId`
- `name`
- `permissions`

Example JSON:

```json
{
  "privilegeGroupId": "pg_platform_admin",
  "name": "Platform Administrator",
  "description": "Full administration across district, source, segment, audience, and users.",
  "permissions": [
    "district.manage",
    "source_registry.manage",
    "segment_definition.manage",
    "audience_records.manage",
    "user_administration.manage"
  ],
  "createdAt": "2026-03-24T12:00:00.000Z",
  "updatedAt": "2026-03-24T12:00:00.000Z"
}
```

### `audit_event`

Purpose:
Stores structured records of administrative activity.

Repository:
`AuditEventRepository`

Recommended indexes:

- `auditEventId`
- `actorId`
- `targetType`
- `targetId`
- `districtId`
- `timestamp`

Example JSON:

```json
{
  "auditEventId": "audit_123",
  "actorType": "user",
  "actorId": "user_admin_1",
  "action": "source.classification.updated",
  "targetType": "source",
  "targetId": "source_kennebunk_post",
  "districtId": "district_me_house_34",
  "timestamp": "2026-03-24T12:15:00.000Z",
  "details": {
    "updatedFields": ["confidenceScore", "tags"]
  }
}
```

## Repository Swap Path for Oracle Autonomous AI JSON Database

The current in-memory repositories are intentionally shaped so they can be replaced with Oracle-backed implementations later. The expected migration path is:

1. keep the TypeScript document types as the canonical model
2. replace repository implementations, not service logic
3. store document collections in Oracle Autonomous AI JSON Database
4. translate the recommended indexes into JSON search or function-based indexes as needed
5. preserve audit events as append-only records

## Notes on Segment Change Safety

`SegmentDefinitionService.updateDefinition` calculates which saved audience segments reference active values that become inactive or removed. This creates a concrete review list instead of silently breaking saved targeting logic.
