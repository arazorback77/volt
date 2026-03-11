import type { DuckDBConnection } from "@duckdb/node-api";
import { DuckDBInstance } from "@duckdb/node-api";

export default defineNitroPlugin(async (nitroApp) => {
  // Initialize in-memory database
  // Use ':memory:' or a filename for persistent storage
  //   const instance = await DuckDBInstance.create(":memory:");
  //   const instance = await DuckDBInstance.create("./server/api/asset.duckdb");
  const instance = await DuckDBInstance.create("./server/db.duckdb");
  //   const instance = await DuckDBInstance.create("./.data/db.duckdb");
  const connection = await instance.connect();

  // Initialize data (optional)
  //   await connection.run(`
  //     CREATE TABLE members (id INTEGER, name VARCHAR, age INTEGER);
  //     INSERT INTO members VALUES (1, 'Alice', 30), (2, 'Bob', 25);
  //   `);

  await connection.run(`
    CREATE TABLE IF NOT EXISTS doc_comments (
      id              VARCHAR PRIMARY KEY,
      doc_path        VARCHAR NOT NULL,
      selected_text   VARCHAR NOT NULL,
      anchor_context  VARCHAR,
      body            VARCHAR NOT NULL,
      author_id       VARCHAR NOT NULL DEFAULT 'anonymous',
      status          VARCHAR NOT NULL DEFAULT 'draft',
      highlight_color VARCHAR NOT NULL DEFAULT 'yellow',
      created_at      TIMESTAMP DEFAULT now(),
      updated_at      TIMESTAMP DEFAULT now(),
      approved_by     VARCHAR,
      approved_at     TIMESTAMP
    );
  `);
  // migration: 기존 테이블에 highlight_color 컬럼이 없으면 추가
  // DuckDB는 ADD COLUMN에서 NOT NULL 제약을 지원하지 않으므로 DEFAULT만 사용
  await connection.run(
    `ALTER TABLE doc_comments ADD COLUMN IF NOT EXISTS highlight_color VARCHAR DEFAULT 'yellow';`
  );
  // migration: anchor_offset — 컨테이너 내 선택 시작 문자 오프셋 (중복 텍스트 정밀 위치용)
  await connection.run(
    `ALTER TABLE doc_comments ADD COLUMN IF NOT EXISTS anchor_offset INTEGER DEFAULT 0;`
  );
  // migration: type — 'comment' | 'highlight' (하이라이트 전용 구분)
  await connection.run(
    `ALTER TABLE doc_comments ADD COLUMN IF NOT EXISTS type VARCHAR DEFAULT 'comment';`
  );

  // users 테이블 — provider-agnostic 유저 모델
  await connection.run(`
    CREATE TABLE IF NOT EXISTS users (
      id           VARCHAR PRIMARY KEY,
      provider     VARCHAR NOT NULL,
      external_id  VARCHAR NOT NULL,
      email        VARCHAR,
      display_name VARCHAR,
      avatar_url   VARCHAR,
      role         VARCHAR DEFAULT 'user',
      created_at   TIMESTAMP DEFAULT now(),
      updated_at   TIMESTAMP DEFAULT now(),
      UNIQUE (provider, external_id)
    );
  `);

  // board_comments 테이블 — Utterances 스타일 게시판 댓글
  await connection.run(`
    CREATE TABLE IF NOT EXISTS board_comments (
      id          VARCHAR PRIMARY KEY,
      page_path   VARCHAR NOT NULL,
      author_id   VARCHAR NOT NULL,
      body        VARCHAR NOT NULL,
      parent_id   VARCHAR,
      created_at  TIMESTAMP DEFAULT now(),
      updated_at  TIMESTAMP DEFAULT now()
    );
  `);

  console.log("DuckDB initialized in duckdb.ts");

  // Make the connection available in server routes
  nitroApp.duckdb = connection;
});

// TypeScript declaration
declare module "nitropack" {
  interface NitroApp {
    duckdb: DuckDBConnection;
  }
}
