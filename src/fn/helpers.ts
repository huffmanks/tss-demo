import { getRequestHeaders } from "@tanstack/react-start/server";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { auth } from "@/lib/auth";

export async function authUser() {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  const user = session?.user;
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

type TxIdResultRow = {
  txid: number;
};

export async function getTxId() {
  const statement = sql`SELECT pg_current_xact_id()::xid::text::int as txid`;
  const result = await db.execute<TxIdResultRow>(statement);

  return result.rows[0]?.txid;
}
