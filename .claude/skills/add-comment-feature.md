---
name: add-comment-feature
description: Document Comment System에 새 기능을 추가할 때 체크리스트
---

# Document Comment System — 기능 추가 체크리스트

새 기능 추가 시 아래 파일들을 순서대로 검토/수정한다.

## 1. DB 스키마 변경이 필요한 경우
- `server/plugins/duckdb.ts` — migration 추가
- `ALTER TABLE ADD COLUMN IF NOT EXISTS col_name TYPE DEFAULT val;` (NOT NULL 금지)

## 2. API 변경
- GET: `server/api/comments/index.get.ts`
- POST: `server/api/comments/index.post.ts`
- PATCH: `server/api/comments/[id]/index.patch.ts`
- DELETE: `server/api/comments/[id]/index.delete.ts`
- 승인: `server/api/comments/[id]/approve.post.ts`

> 신규 route 추가 시 반드시 subdirectory 방식 사용 (`[id]/xxx.ts`)

## 3. Composable
- `app/composables/useDocComment.ts`
  - `DocComment` interface 업데이트
  - API 호출 함수 추가/수정
  - computed (myComments, myHighlights, pendingComments) 필터 검토

## 4. Components
- `app/components/comment/Card.vue` — 상태별 버튼 로직
- `app/components/comment/Panel.vue` — 탭 구성
- `app/components/comment/ContextMenu.vue` — 선택 후 액션
- `app/components/comment/Editor.vue` — 입력 폼

## 5. Page
- `app/pages/blog/[slug].vue` — handle* 함수 연결
