import oracledb, { type Pool } from "oracledb";

import type { OracleConnectionConfig } from "./config.js";

let defaultsConfigured = false;

function configureDriverDefaults(): void {
  if (defaultsConfigured) {
    return;
  }

  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
  oracledb.fetchAsString = [oracledb.CLOB];
  defaultsConfigured = true;
}

export async function createOraclePool(
  config: OracleConnectionConfig,
): Promise<Pool> {
  configureDriverDefaults();

  const poolConfig: oracledb.PoolAttributes = {
    user: config.user,
    password: config.password,
    connectString: config.connectString,
    poolMin: config.poolMin,
    poolMax: config.poolMax,
    poolIncrement: config.poolIncrement,
    stmtCacheSize: 30,
  };

  if (config.walletDir) {
    poolConfig.configDir = config.walletDir;
    poolConfig.walletLocation = config.walletDir;
  }

  if (config.walletPassword) {
    poolConfig.walletPassword = config.walletPassword;
  }

  return oracledb.createPool(poolConfig);
}

export async function closeOraclePool(pool: Pool): Promise<void> {
  await pool.close(10);
}
