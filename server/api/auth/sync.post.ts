import { randomUUID } from "node:crypto";

export default defineEventHandler(async (event) => {
  const { userId: externalId } = event.context.auth();
  if (!externalId) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event) as {
    provider: string;
    email?: string;
    display_name?: string;
    avatar_url?: string;
  };

  const provider = body.provider ?? "clerk";
  const { duckdb } = useNitroApp();
  const now = new Date().toISOString();

  // 기존 유저 조회
  const existing = await duckdb.runAndReadAll(
    `SELECT * FROM users WHERE provider = ? AND external_id = ?`,
    [provider, externalId]
  );
  const rows = existing.getRowObjectsJson() as Record<string, unknown>[];

  if (rows.length > 0) {
    // 업데이트
    await duckdb.runAndReadAll(
      `UPDATE users SET email = ?, display_name = ?, avatar_url = ?, updated_at = ?
       WHERE provider = ? AND external_id = ?`,
      [
        body.email ?? null,
        body.display_name ?? null,
        body.avatar_url ?? null,
        now,
        provider,
        externalId,
      ]
    );
  } else {
    // 신규 생성
    const id = randomUUID();
    await duckdb.run(
      `INSERT INTO users (id, provider, external_id, email, display_name, avatar_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        provider,
        externalId,
        body.email ?? null,
        body.display_name ?? null,
        body.avatar_url ?? null,
        now,
        now,
      ]
    );
  }

  const result = await duckdb.runAndReadAll(
    `SELECT * FROM users WHERE provider = ? AND external_id = ?`,
    [provider, externalId]
  );
  return result.getRowObjectsJson()[0];
});
