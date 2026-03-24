import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import oracledb from "oracledb";

const schemaDirectory = path.resolve(process.cwd(), "database/schema");

function splitStatements(sqlSource) {
  const lines = sqlSource.split(/\r?\n/);
  const statements = [];
  let current = [];

  for (const line of lines) {
    if (line.trim() === "/") {
      const statement = current.join("\n").trim();
      if (statement) {
        statements.push(statement);
      }
      current = [];
      continue;
    }

    current.push(line);
  }

  const trailing = current.join("\n").trim();
  if (trailing) {
    statements.push(trailing);
  }

  return statements;
}

async function readSchemaFiles() {
  const entries = await fs.readdir(schemaDirectory);
  return entries
    .filter((entry) => entry.endsWith(".sql"))
    .sort()
    .map((entry) => path.join(schemaDirectory, entry));
}

async function main() {
  const user = process.env.ORACLE_DB_USER;
  const password = process.env.ORACLE_DB_PASSWORD;
  const connectString = process.env.ORACLE_DB_CONNECT_STRING;
  const walletDir = process.env.ORACLE_DB_WALLET_DIR;
  const walletPassword = process.env.ORACLE_DB_WALLET_PASSWORD;

  if (!user || !password || !connectString) {
    throw new Error(
      "Missing ORACLE_DB_USER, ORACLE_DB_PASSWORD, or ORACLE_DB_CONNECT_STRING.",
    );
  }

  const connection = await oracledb.getConnection({
    user,
    password,
    connectString,
    configDir: walletDir,
    walletLocation: walletDir,
    walletPassword,
  });

  try {
    const schemaFiles = await readSchemaFiles();

    for (const filePath of schemaFiles) {
      const sqlSource = await fs.readFile(filePath, "utf8");
      const statements = splitStatements(sqlSource);

      for (const statement of statements) {
        await connection.execute(statement);
      }
    }

    await connection.commit();
    process.stdout.write("Database schema applied successfully.\n");
  } finally {
    await connection.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});

