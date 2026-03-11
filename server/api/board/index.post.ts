import { randomUUID } from "node:crypto";

export default defineEventHandler(async (event) => {
  const { userId: externalId } = event.context.auth();
  if (!externalId) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event) as {
    page_path: string;
    body: string;
    parent_id?: string;
  };

  if (!body.page_path || !body.body?.trim()) {
    throw createError({ statusCode: 400, message: "page_path and body are required" });
  }

  const { duckdb } = useNitroApp();

  // external_id(Clerk userId) → 내부 users.id 조회
  const userResult = await duckdb.runAndReadAll(
    `SELECT * FROM users WHERE provider = 'clerk' AND external_id = ?`,
    [externalId]
  );
  const user = userResult.getRowObjectsJson()[0] as Record<string, unknown> | undefined;
  if (!user) {
    throw createError({ statusCode: 404, message: "User not found. Please sync first." });
  }

  const id = randomUUID();
  const now = new Date().toISOString();

  await duckdb.run(
    `INSERT INTO board_comments (id, page_path, author_id, body, parent_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, body.page_path, user.id as string, body.body.trim(), body.parent_id ?? null, now, now]
  );

  const result = await duckdb.runAndReadAll(
    `SELECT
       bc.id, bc.page_path, bc.author_id, bc.body, bc.parent_id,
       bc.created_at, bc.updated_at,
       u.display_name, u.avatar_url, u.role AS user_role
     FROM board_comments bc
     LEFT JOIN users u ON bc.author_id = u.id
     WHERE bc.id = ?`,
    [id]
  );

  const row = result.getRowObjectsJson()[0] as Record<string, unknown>;
  return {
    id: row.id,
    page_path: row.page_path,
    author_id: row.author_id,
    body: row.body,
    parent_id: row.parent_id ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: {
      id: row.author_id as string,
      display_name: row.display_name ?? null,
      avatar_url: row.avatar_url ?? null,
      role: (row.user_role as string) ?? "user",
    },
  };
});
