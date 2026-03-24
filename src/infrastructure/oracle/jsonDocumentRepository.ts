import type { Result, Pool } from "oracledb";

type JsonRow = {
  DOC_ID: string;
  PAYLOAD: unknown;
};

function parsePayload<T>(payload: unknown): T {
  if (typeof payload === "string") {
    return JSON.parse(payload) as T;
  }

  return payload as T;
}

export class OracleJsonDocumentRepository<TDocument extends Record<string, unknown>> {
  constructor(
    protected readonly pool: Pool,
    protected readonly tableName: string,
  ) {}

  protected async execute<T>(
    sql: string,
    binds: Record<string, unknown> = {},
  ): Promise<Result<T>> {
    const connection = await this.pool.getConnection();
    try {
      return await connection.execute<T>(sql, binds, {
        autoCommit: true,
      });
    } finally {
      await connection.close();
    }
  }

  protected toDocument(payload: unknown): TDocument {
    return parsePayload<TDocument>(payload);
  }

  async getById(docId: string): Promise<TDocument | undefined> {
    const result = await this.execute<JsonRow>(
      `select doc_id as "DOC_ID", payload as "PAYLOAD"
       from ${this.tableName}
       where doc_id = :doc_id`,
      { doc_id: docId },
    );

    const row = result.rows?.[0];
    return row ? this.toDocument(row.PAYLOAD) : undefined;
  }

  async list(): Promise<TDocument[]> {
    const result = await this.execute<JsonRow>(
      `select doc_id as "DOC_ID", payload as "PAYLOAD"
       from ${this.tableName}
       order by created_at asc`,
    );

    return (result.rows ?? []).map((row) => this.toDocument(row.PAYLOAD));
  }

  async save(docId: string, document: TDocument): Promise<void> {
    const payload = JSON.stringify(document);

    await this.execute(
      `merge into ${this.tableName} target
       using (
         select :doc_id as doc_id, json(:payload) as payload
         from dual
       ) source
       on (target.doc_id = source.doc_id)
       when matched then update
         set target.payload = source.payload,
             target.updated_at = systimestamp
       when not matched then insert
         (doc_id, payload, created_at, updated_at)
         values (source.doc_id, source.payload, systimestamp, systimestamp)`,
      {
        doc_id: docId,
        payload,
      },
    );
  }
}
