import {
  InMemoryAudienceRecordRepository,
  InMemoryAudienceSegmentRepository,
  InMemoryAuditEventRepository,
  InMemoryDistrictRepository,
  InMemoryPrivilegeGroupRepository,
  InMemorySegmentDefinitionRepository,
  InMemorySourceRepository,
  InMemoryUserRepository,
} from "./inMemoryRepositories.js";
import { SCREEN_PERMISSIONS } from "./permissions.js";
import type { RepositoryBundle } from "./repositories.js";
import type {
  AudienceRecordDocument,
  AudienceSegmentDocument,
  DistrictDocument,
  PrivilegeGroupDocument,
  SegmentDefinitionDocument,
  SourceDocument,
  UserDocument,
} from "./types.js";
import {
  SegmentDefinitionService,
  SourceAdministrationService,
  UserAdministrationService,
} from "./services.js";
import {
  validateAudienceRecord,
  validateAudienceSegment,
  validateDistrict,
  validatePrivilegeGroup,
  validateSegmentDefinition,
  validateSource,
  validateUser,
} from "./validation.js";

export interface DemoContext {
  repositories: RepositoryBundle;
  services: {
    users: UserAdministrationService;
    segmentDefinitions: SegmentDefinitionService;
    sources: SourceAdministrationService;
  };
  seedData: {
    district: DistrictDocument;
    adminUser: UserDocument;
    analystUser: UserDocument;
    privilegeGroups: PrivilegeGroupDocument[];
    segmentDefinitions: SegmentDefinitionDocument[];
    audienceSegments: AudienceSegmentDocument[];
    audienceRecords: AudienceRecordDocument[];
    sources: SourceDocument[];
  };
}

function createRepositories(): RepositoryBundle {
  return {
    districts: new InMemoryDistrictRepository(),
    sources: new InMemorySourceRepository(),
    segmentDefinitions: new InMemorySegmentDefinitionRepository(),
    audienceSegments: new InMemoryAudienceSegmentRepository(),
    audienceRecords: new InMemoryAudienceRecordRepository(),
    users: new InMemoryUserRepository(),
    privilegeGroups: new InMemoryPrivilegeGroupRepository(),
    auditEvents: new InMemoryAuditEventRepository(),
  };
}

export async function createDemoContext(): Promise<DemoContext> {
  const repositories = createRepositories();
  const now = new Date("2026-03-24T12:00:00.000Z").toISOString();

  const district: DistrictDocument = {
    districtId: "district_me_house_34",
    state: "Maine",
    officeType: "State House",
    districtName: "Maine House District 34",
    districtNumber: "34",
    municipalities: ["Arundel", "Kennebunk", "Kennebunkport"],
    zipCodes: ["04043", "04046"],
    neighborhoods: [],
    notes: "Seed district used for administration and source-classification examples.",
    status: "active",
    createdBy: "system",
    createdAt: now,
    updatedAt: now,
  };

  const privilegeGroups: PrivilegeGroupDocument[] = [
    {
      privilegeGroupId: "pg_platform_admin",
      name: "Platform Administrator",
      description: "Full administration across district, source, segment, audience, and users.",
      permissions: Object.values(SCREEN_PERMISSIONS),
      createdAt: now,
      updatedAt: now,
    },
    {
      privilegeGroupId: "pg_campaign_analyst",
      name: "Campaign Analyst",
      description: "Read-only analytical role for future issue workflows.",
      permissions: [],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const adminUser: UserDocument = {
    userId: "user_admin_1",
    name: "Admin User",
    email: "admin@citizensignal.local",
    status: "active",
    districtIds: [district.districtId],
    privilegeGroupIds: ["pg_platform_admin"],
    preferences: {
      timezone: "America/New_York",
    },
    createdAt: now,
    updatedAt: now,
  };

  const analystUser: UserDocument = {
    userId: "user_analyst_1",
    name: "Analyst User",
    email: "analyst@citizensignal.local",
    status: "active",
    districtIds: [district.districtId],
    privilegeGroupIds: ["pg_campaign_analyst"],
    preferences: {
      timezone: "America/New_York",
    },
    createdAt: now,
    updatedAt: now,
  };

  const segmentDefinitions: SegmentDefinitionDocument[] = [
    {
      segmentDefinitionId: "segment_def_age_group",
      dimensionKey: "age_group",
      name: "Age Group",
      description: "Normalized age-group values used in analysis and outreach.",
      values: [
        { valueId: "age_18_29", key: "18_29", label: "18-29", displayOrder: 1, status: "active" },
        { valueId: "age_30_44", key: "30_44", label: "30-44", displayOrder: 2, status: "active" },
        { valueId: "age_45_64", key: "45_64", label: "45-64", displayOrder: 3, status: "active" },
        { valueId: "age_65_plus", key: "65_plus", label: "65+", displayOrder: 4, status: "active" },
      ],
      valueType: "single_select",
      displayOrder: 1,
      status: "active",
      createdBy: adminUser.userId,
      updatedBy: adminUser.userId,
      createdAt: now,
      updatedAt: now,
    },
    {
      segmentDefinitionId: "segment_def_occupation_group",
      dimensionKey: "occupation_group",
      name: "Occupation Group",
      description: "Administrator-managed occupation classifications used for audience analysis.",
      values: [
        {
          valueId: "occupation_white_collar_professional",
          key: "white_collar_professional",
          label: "White Collar Professional",
          displayOrder: 1,
          status: "active",
        },
        {
          valueId: "occupation_blue_collar_worker",
          key: "blue_collar_worker",
          label: "Blue Collar Worker",
          displayOrder: 2,
          status: "active",
        },
        {
          valueId: "occupation_stay_at_home_parent",
          key: "stay_at_home_parent",
          label: "Stay-at-Home Parent",
          displayOrder: 3,
          status: "active",
        },
        {
          valueId: "occupation_teacher",
          key: "teacher",
          label: "Teacher",
          displayOrder: 4,
          status: "active",
        },
        {
          valueId: "occupation_healthcare_worker",
          key: "healthcare_worker",
          label: "Healthcare Worker",
          displayOrder: 5,
          status: "active",
        },
        {
          valueId: "occupation_small_business_owner",
          key: "small_business_owner",
          label: "Small Business Owner",
          displayOrder: 6,
          status: "active",
        },
        {
          valueId: "occupation_retiree",
          key: "retiree",
          label: "Retiree",
          displayOrder: 7,
          status: "active",
        },
      ],
      valueType: "single_select",
      displayOrder: 5,
      status: "active",
      createdBy: adminUser.userId,
      updatedBy: adminUser.userId,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const teacherSegment: AudienceSegmentDocument = {
    segmentId: "aud_segment_teachers",
    districtId: district.districtId,
    name: "District Teachers",
    description: "Saved segment that targets teachers in Maine House District 34.",
    filters: {
      criteria: [
        {
          dimensionKey: "occupation_group",
          operator: "in",
          valueIds: ["occupation_teacher"],
        },
      ],
    },
    tags: ["education", "community-leaders"],
    estimatedAudienceSize: 180,
    createdBy: adminUser.userId,
    createdAt: now,
    updatedAt: now,
    isArchived: false,
  };
  const audienceSegments: AudienceSegmentDocument[] = [teacherSegment];

  const audienceRecords: AudienceRecordDocument[] = [
    {
      audienceRecordId: "aud_record_1",
      districtIds: [district.districtId],
      fullName: "Jordan Sample",
      municipality: "Kennebunk",
      zipCode: "04043",
      occupationGroup: "occupation_teacher",
      issueInterests: ["schools", "property_taxes"],
      campaignTags: ["volunteer"],
      contactChannels: ["email"],
      consent: {
        canEmail: true,
        canText: false,
      },
      sourceSystem: "seed",
      segmentIds: [teacherSegment.segmentId],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const sources: SourceDocument[] = [
    {
      sourceId: "source_kennebunk_post",
      districtIds: [district.districtId],
      name: "Kennebunk Post",
      sourceType: "local_newspaper",
      url: "https://example.com/kennebunk-post",
      platform: "web",
      coverage: {
        municipalities: ["Kennebunk", "Kennebunkport"],
        zipCodes: ["04043", "04046"],
        districts: [district.districtId],
      },
      politicalLeaning: "local_general",
      framingTendency: "community-reporting",
      trustScore: 0.82,
      confidenceScore: 0.78,
      updateFrequency: "weekly",
      ingestionMethod: "manual_registry",
      isActive: true,
      tags: ["hyperlocal", "district-34"],
      createdAt: now,
      updatedAt: now,
    },
  ];

  validateDistrict(district);
  await repositories.districts.save(district);

  for (const group of privilegeGroups) {
    validatePrivilegeGroup(group);
    await repositories.privilegeGroups.save(group);
  }

  for (const user of [adminUser, analystUser]) {
    validateUser(user);
    await repositories.users.save(user);
  }

  for (const definition of segmentDefinitions) {
    validateSegmentDefinition(definition);
    await repositories.segmentDefinitions.save(definition);
  }

  for (const segment of audienceSegments) {
    validateAudienceSegment(segment);
    await repositories.audienceSegments.save(segment);
  }

  for (const record of audienceRecords) {
    validateAudienceRecord(record);
    await repositories.audienceRecords.save(record);
  }

  for (const source of sources) {
    validateSource(source);
    await repositories.sources.save(source);
  }

  return {
    repositories,
    services: {
      users: new UserAdministrationService(repositories),
      segmentDefinitions: new SegmentDefinitionService(repositories),
      sources: new SourceAdministrationService(repositories),
    },
    seedData: {
      district,
      adminUser,
      analystUser,
      privilegeGroups,
      segmentDefinitions,
      audienceSegments,
      audienceRecords,
      sources,
    },
  };
}
