import { randomUUID } from "node:crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as {
    doc_path: string;
    selected_text: string;
    anchor_context?: string;
    anchor_offset?: number;
    body?: string;
    author_id?: string;
    highlight_color?: string;
    type?: string;
  };

  const type = body.type ?? "comment";

  if (!body.doc_path || !body.selected_text) {
    throw createError({ statusCode: 400, message: "doc_path, selected_text are required" });
  }
  if (type === "comment" && !body.body) {
    throw createError({ statusCode: 400, message: "body is required for comment type" });
  }

  const id = randomUUID();
  const { duckdb } = useNitroApp();

  await duckdb.run(
    `INSERT INTO doc_comments (id, doc_path, selected_text, anchor_context, anchor_offset, body, author_id, highlight_color, type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      body.doc_path,
      body.selected_text,
      body.anchor_context ?? null,
      body.anchor_offset ?? 0,
      body.body ?? "",
      body.author_id ?? "anonymous",
      body.highlight_color ?? "yellow",
      type,
    ]
  );

  const result = await duckdb.runAndReadAll(
    "SELECT * FROM doc_comments WHERE id = ?",
    [id]
  );
  return result.getRowObjectsJson()[0];
});
