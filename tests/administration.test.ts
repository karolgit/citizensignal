import { describe, expect, it } from "vitest";

import { AuthorizationError } from "../src/admin/permissions.js";
import { createDemoContext } from "../src/admin/seed.js";

describe("administration foundation", () => {
  it("blocks non-admin users from creating users", async () => {
    const context = await createDemoContext();

    await expect(
      context.services.users.createUser(context.seedData.analystUser, {
        name: "Unauthorized User",
        email: "unauthorized@citizensignal.local",
        districtIds: [context.seedData.district.districtId],
        privilegeGroupIds: ["pg_campaign_analyst"],
        timezone: "America/New_York",
      }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("creates users and records privilege assignment audits", async () => {
    const context = await createDemoContext();

    const createdUser = await context.services.users.createUser(
      context.seedData.adminUser,
      {
        name: "Field Director",
        email: "field.director@citizensignal.local",
        districtIds: [context.seedData.district.districtId],
        privilegeGroupIds: ["pg_campaign_analyst"],
        timezone: "America/New_York",
      },
    );

    const updatedUser = await context.services.users.assignPrivilegeGroups(
      context.seedData.adminUser,
      createdUser.userId,
      ["pg_platform_admin"],
    );

    expect(updatedUser.privilegeGroupIds).toEqual(["pg_platform_admin"]);

    const auditEvents = await context.repositories.auditEvents.list();
    expect(auditEvents.map((event) => event.action)).toContain("user.created");
    expect(auditEvents.map((event) => event.action)).toContain(
      "user.privilege-groups.updated",
    );
  });

  it("flags saved audience segments that are impacted by segment definition changes", async () => {
    const context = await createDemoContext();

    const occupationDefinition = context.seedData.segmentDefinitions.find(
      (definition) => definition.dimensionKey === "occupation_group",
    );
    expect(occupationDefinition).toBeDefined();

    const result = await context.services.segmentDefinitions.updateDefinition(
      context.seedData.adminUser,
      occupationDefinition!.segmentDefinitionId,
      {
        values: occupationDefinition!.values.map((value) =>
          value.valueId === "occupation_teacher"
            ? { ...value, status: "inactive" }
            : value,
        ),
      },
    );

    expect(result.impactedSegmentIds).toContain("aud_segment_teachers");
  });

  it("registers and reclassifies district sources with audit events", async () => {
    const context = await createDemoContext();

    const source = await context.services.sources.registerSource(
      context.seedData.adminUser,
      {
        districtIds: [context.seedData.district.districtId],
        name: "Kennebunk Currents",
        sourceType: "town_newsletter",
        url: "https://example.com/kennebunk-currents",
        platform: "newsletter",
        coverage: {
          municipalities: ["Kennebunk"],
          zipCodes: ["04043"],
          districts: [context.seedData.district.districtId],
        },
        politicalLeaning: "local_general",
        framingTendency: "town-updates",
        trustScore: 0.8,
        confidenceScore: 0.74,
        updateFrequency: "weekly",
        ingestionMethod: "manual_registry",
        isActive: true,
        tags: ["newsletter", "town"],
      },
    );

    const updatedSource = await context.services.sources.updateSourceClassification(
      context.seedData.adminUser,
      source.sourceId,
      {
        tags: ["newsletter", "town", "district-34-priority"],
        confidenceScore: 0.86,
      },
    );

    expect(updatedSource.tags).toContain("district-34-priority");
    expect(updatedSource.confidenceScore).toBe(0.86);

    const auditEvents = await context.repositories.auditEvents.list();
    expect(auditEvents.map((event) => event.action)).toContain("source.created");
    expect(auditEvents.map((event) => event.action)).toContain(
      "source.classification.updated",
    );
  });
});
