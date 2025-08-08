import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export const runtime = 'nodejs';

const db = new Database(':memory:');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    password TEXT
  );

  INSERT OR IGNORE INTO users (id, password) VALUES
    ('user', 'kddi0077Sample!');
`);

type Row = { id: string };

export async function POST(req: NextRequest) {
  const { userId, password } = await req.json();

  const rawSql =
    `SELECT id FROM users` +
    ` WHERE id='${userId}'` +
    ` AND password='${password}';`;

  let rows: Row[];
  try {
    rows = db.prepare(rawSql).all() as Row[];
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  // rows が 0 のときはメッセージを変更し、401 で返す
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json(
      { sql: rawSql, result: [], message: '認証に失敗しました' },
      { status: 401 }
    );
  }

  // 成功時：メッセージを入れてクッキー発行
  const uid = rows[0].id;
  const token = Buffer.from(JSON.stringify({ uid, iat: Date.now() })).toString('base64url');

  const res = NextResponse.json({
    sql: rawSql,
    result: rows,
    message: 'ログインしました',
  });

  res.cookies.set({
    name: 'session',
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 1h
  });

  return res;
}