import { sql } from "drizzle-orm";

import { db } from "@/db";

type TxIdResultRow = {
  txid: number;
};

export async function getTxId() {
  const statement = sql`SELECT pg_current_xact_id()::xid::text::int as txid`;
  const result = await db.execute<TxIdResultRow>(statement);

  return result.rows[0]?.txid;
}
