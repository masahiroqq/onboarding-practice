import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database(':memory:');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    password TEXT
  );

  INSERT OR IGNORE INTO users (id, password) VALUES
    ('user', 'kddi0077Sample!');
`);

export async function POST(req: NextRequest) {
  const { userId, password } = await req.json();

  const rawSql =
    `SELECT id FROM users` +
    ` WHERE id='${userId}'` +
    ` AND password='${password}';`;

  let rows;
  try {
    rows = db.prepare(rawSql).all();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  return NextResponse.json({ sql: rawSql, result: rows });
}