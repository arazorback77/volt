export default defineEventHandler(async (event) => {
  const { path } = getQuery(event) as { path?: string };
  if (!path) {
    throw createError({ statusCode: 400, message: "path is required" });
  }

  const { duckdb } = useNitroApp();

  const result = await duckdb.runAndReadAll(
    `SELECT
       bc.id, bc.page_path, bc.author_id, bc.body, bc.parent_id,
       bc.created_at, bc.updated_at,
       u.display_name, u.avatar_url, u.role AS user_role
     FROM board_comments bc
     LEFT JOIN users u ON bc.author_id = u.id
     WHERE bc.page_path = ?
     ORDER BY bc.created_at ASC`,
    [path]
  );

  const rows = result.getRowObjectsJson() as Record<string, unknown>[];
  return rows.map((row) => ({
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
  }));
});
