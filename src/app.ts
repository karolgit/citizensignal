import type { DemoContext } from "./admin/seed.js";

export const APP_NAME = "CitizenSignal";

export function createAppBanner(context: DemoContext): string {
  const userCount = [context.seedData.adminUser, context.seedData.analystUser].length;

  return [
    `${APP_NAME} administration foundation is ready.`,
    `Districts: 1`,
    `Privilege groups: ${context.seedData.privilegeGroups.length}`,
    `Users: ${userCount}`,
    `Segment definitions: ${context.seedData.segmentDefinitions.length}`,
    `Seed sources: ${context.seedData.sources.length}`,
  ].join("\n");
}
