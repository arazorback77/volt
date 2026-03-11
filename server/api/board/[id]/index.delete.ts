export default defineEventHandler(async (event) => {
  const { userId: externalId } = event.context.auth();
  if (!externalId) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const commentId = getRouterParam(event, "id");
  const { duckdb } = useNitroApp();

  // 내부 userId + role 조회
  const userResult = await duckdb.runAndReadAll(
    `SELECT id, role FROM users WHERE provider = 'clerk' AND external_id = ?`,
    [externalId]
  );
  const user = userResult.getRowObjectsJson()[0] as Record<string, unknown> | undefined;
  if (!user) {
    throw createError({ statusCode: 404, message: "User not found." });
  }

  // 댓글 조회
  const existing = await duckdb.runAndReadAll(
    `SELECT * FROM board_comments WHERE id = ?`,
    [commentId]
  );
  const comment = existing.getRowObjectsJson()[0] as Record<string, unknown> | undefined;
  if (!comment) {
    throw createError({ statusCode: 404, message: "Comment not found." });
  }

  // 소유자 or admin만 삭제 가능
  if (comment.author_id !== user.id && user.role !== "admin") {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  await duckdb.runAndReadAll(`DELETE FROM board_comments WHERE id = ?`, [commentId]);
  return { success: true };
});
