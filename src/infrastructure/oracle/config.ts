export interface OracleConnectionConfig {
  user: string;
  password: string;
  connectString: string;
  walletDir?: string;
  walletPassword?: string;
  poolMin: number;
  poolMax: number;
  poolIncrement: number;
}

function readOptionalInteger(
  value: string | undefined,
  fallback: number,
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Expected an integer value, received ${value}.`);
  }

  return parsed;
}

export function readOracleConnectionConfig(
  env: NodeJS.ProcessEnv = process.env,
): OracleConnectionConfig {
  const user = env.ORACLE_DB_USER;
  const password = env.ORACLE_DB_PASSWORD;
  const connectString = env.ORACLE_DB_CONNECT_STRING;

  if (!user || !password || !connectString) {
    throw new Error(
      "Missing Oracle database configuration. Expected ORACLE_DB_USER, ORACLE_DB_PASSWORD, and ORACLE_DB_CONNECT_STRING.",
    );
  }

  const config: OracleConnectionConfig = {
    user,
    password,
    connectString,
    poolMin: readOptionalInteger(env.ORACLE_DB_POOL_MIN, 1),
    poolMax: readOptionalInteger(env.ORACLE_DB_POOL_MAX, 4),
    poolIncrement: readOptionalInteger(env.ORACLE_DB_POOL_INCREMENT, 1),
  };

  if (env.ORACLE_DB_WALLET_DIR) {
    config.walletDir = env.ORACLE_DB_WALLET_DIR;
  }

  if (env.ORACLE_DB_WALLET_PASSWORD) {
    config.walletPassword = env.ORACLE_DB_WALLET_PASSWORD;
  }

  return config;
}
