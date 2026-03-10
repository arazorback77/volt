# Volt — Claude Project Guide

## Tech Stack
- **Nuxt 4** + **Nuxt Content v3** + **Nuxt UI v4.2.1** + Tailwind CSS
- **DuckDB** (`@duckdb/node-api`) — `server/plugins/duckdb.ts` → `nitroApp.duckdb`
- **Clerk** (`@clerk/nuxt`) — 인증
- **reka-ui** — SplitterGroup / SplitterPanel (resizable layout)
- **PrimeVue** — 일부 UI 컴포넌트

## Project Structure
```
app/
  components/comment/   # ContextMenu, Editor, Card, Panel
  composables/          # useDocComment.ts
  layouts/section/      # tl(tmrb).vue — 4-slot layout
  pages/blog/[slug].vue # document page
server/
  api/comments/         # GET, POST, [id]/PATCH, [id]/DELETE, [id]/approve.post
  plugins/duckdb.ts     # DB init + migrations
```

## Key Conventions

### DuckDB
- `ALTER TABLE ADD COLUMN IF NOT EXISTS` — `NOT NULL` 사용 금지 (DEFAULT만 허용)
- UPDATE/DELETE는 `runAndReadAll()` 사용 (`run()` 대신)
- `now()` SQL 함수 대신 JS `new Date().toISOString()` 파라미터 전달

### Nitro Route 구조
- `[id].patch.ts` (flat) 방식은 `getRouterParam(event, "id")`가 `undefined` 반환하는 버그 있음
- 반드시 **subdirectory** 방식 사용: `[id]/index.patch.ts`, `[id]/approve.post.ts`

### Vue Reactivity
- 배열 항목 업데이트 시 `arr[idx] = val` 대신 `arr.splice(idx, 1, val)` 사용

### Layout Slots (`tl(tmrb).vue`)
| 슬롯 | 역할 |
|------|------|
| `#left` | 좌측 nav (collapsible) |
| `#toc` | TOC |
| `#main` | 본문 |
| `#right` | 코멘트 패널 |
| `#footer` | 하단 (collapsible) |

### Nuxt UI v4
- `UTabs` slot: `#content="{ item }"` (구버전 `#[item.slot]` 사용 금지)

## Document Comment System

### doc_comments 스키마
```sql
id VARCHAR PRIMARY KEY
doc_path VARCHAR          -- '/blog/my-post'
selected_text VARCHAR
anchor_context VARCHAR    -- 앞뒤 50자
anchor_offset INTEGER     -- 선택 시작점의 container 내 character offset
body VARCHAR              -- highlight는 NULL 가능
type VARCHAR              -- 'comment' | 'highlight'
author_id VARCHAR         -- useCookie("volt-doc-uid") 익명 ID
status VARCHAR            -- draft | pending | approved | rejected
highlight_color VARCHAR   -- yellow | green | blue | pink | purple
created_at, updated_at, approved_by, approved_at
```

### DOM Highlight 방식
- comment: `textDecoration: "underline dotted"` (span, 배경 없음)
- highlight: `backgroundColor: color` (span)
- `clearHighlights()` → `container.normalize()` → `applyHighlights()` 순서로 재적용
- `[data-comment-id]` selector로 span 탐색/제거

### GET API 필터
```sql
(type = 'highlight' AND author_id = ?)          -- highlight: 작성자만
OR (type = 'comment' AND (status != 'draft' OR author_id = ?))
```

## Development

### 서버 실행
```bash
npm run dev   # localhost:3000
```
- `.claude/launch.json` — `volt-dev` (port 3000)

### 테스트
**사용자가 직접 브라우저에서 테스트**한다. 코드 수정 후 서버를 자동으로 시작하거나 스크린샷을 찍는 작업은 불필요하다.

<verification_workflow>
1. 서버 로그에서 컴파일/런타임 에러 없음을 확인 (`preview_logs level=error`)
2. HMR 업데이트 로그 확인 (정상 반영 여부)
3. 브라우저 테스트는 사용자가 직접 수행 — 추가 자동화 불필요
</verification_workflow>
