export default defineEventHandler(async (event) => {
  const { userId: externalId } = event.context.auth();
  if (!externalId) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const commentId = getRouterParam(event, "id");
  const body = await readBody(event) as { body: string };

  if (!body.body?.trim()) {
    throw createError({ statusCode: 400, message: "body is required" });
  }

  const { duckdb } = useNitroApp();

  // 내부 userId 조회
  const userResult = await duckdb.runAndReadAll(
    `SELECT id FROM users WHERE provider = 'clerk' AND external_id = ?`,
    [externalId]
  );
  const user = userResult.getRowObjectsJson()[0] as Record<string, unknown> | undefined;
  if (!user) {
    throw createError({ statusCode: 404, message: "User not found." });
  }

  // 댓글 조회 + 소유자 확인
  const existing = await duckdb.runAndReadAll(
    `SELECT * FROM board_comments WHERE id = ?`,
    [commentId]
  );
  const comment = existing.getRowObjectsJson()[0] as Record<string, unknown> | undefined;
  if (!comment) {
    throw createError({ statusCode: 404, message: "Comment not found." });
  }
  if (comment.author_id !== user.id) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  const now = new Date().toISOString();
  await duckdb.runAndReadAll(
    `UPDATE board_comments SET body = ?, updated_at = ? WHERE id = ?`,
    [body.body.trim(), now, commentId]
  );

  const result = await duckdb.runAndReadAll(
    `SELECT
       bc.id, bc.page_path, bc.author_id, bc.body, bc.parent_id,
       bc.created_at, bc.updated_at,
       u.display_name, u.avatar_url, u.role AS user_role
     FROM board_comments bc
     LEFT JOIN users u ON bc.author_id = u.id
     WHERE bc.id = ?`,
    [commentId]
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
