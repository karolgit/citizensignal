import type { Pool } from "oracledb";

import { SegmentDefinitionService, SourceAdministrationService, UserAdministrationService } from "../../admin/services.js";
import type { RepositoryBundle } from "../../admin/repositories.js";
import { createOraclePool, closeOraclePool } from "./connection.js";
import { readOracleConnectionConfig } from "./config.js";
import { createOracleRepositoryBundle } from "./repositoryBundle.js";

export interface OracleAdministrationContext {
  pool: Pool;
  repositories: RepositoryBundle;
  services: {
    users: UserAdministrationService;
    segmentDefinitions: SegmentDefinitionService;
    sources: SourceAdministrationService;
  };
  close(): Promise<void>;
}

export async function createOracleAdministrationContext(): Promise<OracleAdministrationContext> {
  const pool = await createOraclePool(readOracleConnectionConfig());
  const repositories = createOracleRepositoryBundle(pool);

  return {
    pool,
    repositories,
    services: {
      users: new UserAdministrationService(repositories),
      segmentDefinitions: new SegmentDefinitionService(repositories),
      sources: new SourceAdministrationService(repositories),
    },
    async close(): Promise<void> {
      await closeOraclePool(pool);
    },
  };
}
