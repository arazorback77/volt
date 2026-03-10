export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event) as {
    body?: string;
    status?: "draft" | "pending" | "approved" | "rejected";
  };

  console.log("[PATCH /api/comments/:id]", { id, body });

  if (!id) throw createError({ statusCode: 400, message: "id is required" });

  const { duckdb } = useNitroApp();

  const sets: string[] = ["updated_at = ?"];
  const params: unknown[] = [new Date().toISOString()];

  if (body.body !== undefined) {
    sets.push("body = ?");
    params.push(body.body);
  }
  if (body.status !== undefined) {
    sets.push("status = ?");
    params.push(body.status);
  }

  params.push(id);
  await duckdb.runAndReadAll(
    `UPDATE doc_comments SET ${sets.join(", ")} WHERE id = ?`,
    params
  );

  const result = await duckdb.runAndReadAll(
    "SELECT * FROM doc_comments WHERE id = ?",
    [id]
  );
  return result.getRowObjectsJson()[0];
});
