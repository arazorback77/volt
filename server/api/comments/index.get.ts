export default defineEventHandler(async (event) => {
  const { path, author_id } = getQuery(event) as {
    path?: string;
    author_id?: string;
  };
  if (!path) throw createError({ statusCode: 400, message: "path is required" });

  const { duckdb } = useNitroApp();

  // highlight는 항상 작성자만, comment는 draft만 작성자 제한
  const result = await duckdb.runAndReadAll(
    `SELECT * FROM doc_comments
     WHERE doc_path = ?
       AND (
         (type = 'highlight' AND author_id = ?)
         OR (type = 'comment' AND (status != 'draft' OR author_id = ?))
         OR (type IS NULL AND (status != 'draft' OR author_id = ?))
       )
     ORDER BY created_at ASC`,
    [path, author_id ?? "", author_id ?? "", author_id ?? ""]
  );
  return result.getRowObjectsJson();
});
