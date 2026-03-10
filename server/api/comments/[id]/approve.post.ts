import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "id is required" });

  const { duckdb } = useNitroApp();

  // 1. 코멘트 조회
  const rows = (await duckdb.runAndReadAll(
    "SELECT * FROM doc_comments WHERE id = ?",
    [id]
  )).getRowObjectsJson();

  if (!rows.length) throw createError({ statusCode: 404, message: "Comment not found" });

  const comment = rows[0] as {
    id: string;
    doc_path: string;
    selected_text: string;
    anchor_context: string | null;
    body: string;
    status: string;
  };

  if (comment.status !== "pending") {
    throw createError({ statusCode: 400, message: "Only pending comments can be approved" });
  }

  // 2. .md 파일 경로 계산 (doc_path: '/blog/my-post' → content/blog/my-post.md)
  const slug = comment.doc_path.replace(/^\//, ""); // 'blog/my-post'
  const mdPath = resolve(process.cwd(), "content", `${slug}.md`);

  // 3. 파일 읽기
  let content: string;
  try {
    content = await readFile(mdPath, "utf-8");
  } catch {
    throw createError({ statusCode: 404, message: `File not found: ${mdPath}` });
  }

  // 4. anchor_context 로 삽입 위치 탐색
  const anchor = comment.anchor_context;
  let insertIndex: number;

  if (anchor) {
    const anchorIdx = content.indexOf(anchor);
    if (anchorIdx !== -1) {
      // anchor 단락의 끝(다음 빈 줄 또는 파일 끝)을 찾아 그 위치에 삽입
      const afterAnchor = anchorIdx + anchor.length;
      const nextBlankLine = content.indexOf("\n\n", afterAnchor);
      insertIndex = nextBlankLine !== -1 ? nextBlankLine : content.length;
    } else {
      // anchor 못 찾으면 파일 끝에 추가
      insertIndex = content.length;
    }
  } else {
    insertIndex = content.length;
  }

  // 5. <details> collapsible 블록 생성
  const shortText =
    comment.selected_text.length > 60
      ? comment.selected_text.slice(0, 60) + "..."
      : comment.selected_text;

  const detailsBlock = `\n\n<details>\n<summary><strong>[Note]</strong> <em>"${shortText}"</em></summary>\n\n${comment.body}\n\n</details>`;

  // 6. 파일 수정 후 저장
  const newContent =
    content.slice(0, insertIndex) + detailsBlock + content.slice(insertIndex);
  await writeFile(mdPath, newContent, "utf-8");

  // 7. 코멘트 status → approved
  await duckdb.run(
    "UPDATE doc_comments SET status = 'approved', approved_at = now(), updated_at = now() WHERE id = ?",
    [id]
  );

  return { success: true, mdPath };
});
