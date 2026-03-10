export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  console.log("[DELETE /api/comments/:id]", { id });

  if (!id) throw createError({ statusCode: 400, message: "id is required" });

  const { duckdb } = useNitroApp();
  await duckdb.runAndReadAll("DELETE FROM doc_comments WHERE id = ?", [id]);
  return { success: true };
});
