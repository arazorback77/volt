---
name: debug-api
description: Comment API 디버깅 절차
---

# Comment API 디버깅

## 400 오류 / id undefined
- **원인**: Nitro flat route 네이밍 버그
- **확인**: `server/api/comments/` 디렉토리 구조 점검
- **정상 구조**:
  ```
  server/api/comments/
    index.get.ts
    index.post.ts
    [id]/
      index.patch.ts
      index.delete.ts
      approve.post.ts
  ```

## 500 오류 / DuckDB
- `runAndReadAll()` 결과를 `.getRowObjectsJson()` 로 읽는지 확인
- `ALTER TABLE ADD COLUMN IF NOT EXISTS ... NOT NULL` → NOT NULL 제거
- `now()` SQL 함수 → `new Date().toISOString()` JS 파라미터로 교체

## Vue 반응성 문제 (목록 업데이트 안 됨)
- `comments.value[idx] = updated` → `comments.value.splice(idx, 1, updated)`

## 서버 로그 확인
- `preview_logs level=error` 로 에러만 필터링
- PATCH/DELETE 요청 시 `[id]` 가 실제 UUID인지 로그 확인
