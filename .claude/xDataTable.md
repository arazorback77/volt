# XDataTable 컴포넌트 사용 가이드

PrimeVue DataTable 기반의 XLSX/CSV 렌더링 컴포넌트.
정렬(sort) 기능이 필요할 때 `XlsxTable` 대신 사용합니다.

## 파일 위치

XLSX / CSV 파일은 `public/xlsx/` 디렉터리에 배치합니다.

```
public/
  xlsx/
    report.xlsx
    data.csv
```

---

## MDC 문법

### 인라인 (간단한 경우)

```markdown
:x-data-table{file="파일명"}
```

### 블록 (props가 많을 경우)

```markdown
::x-data-table
---
file: sample.xlsx
tab: Sheet1
sortable: true
colSize: 80,120,200
bodyAlign: L,C,R
---
::
```

- 확장자 생략 시 `.xlsx` 자동 추가
- `file="data"` → `public/xlsx/data.xlsx`
- `file="data.csv"` → `public/xlsx/data.csv`

---

## Props 레퍼런스

| prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `file` | `string` | **(필수)** | 파일명 (확장자 생략 가능) |
| `tab` | `string` | 첫 번째 시트 | 시트명. 없으면 에러 메시지 표시 |
| `headerRows` | `number` | `1` | 헤더 행 수. 마지막 헤더 행이 컬럼 레이블로 사용됨 |
| `headerAlign` | `string` | `"C"` | 헤더 셀 정렬. 단일값=전체 적용 |
| `bodyAlign` | `string` | `"L"` | 내용 셀 정렬. 단일값=전체 적용 |
| `colSize` | `string` | — | 열 너비 (px만 지원). 미지정 시 브라우저 자동 너비 |
| `sortable` | `boolean` | `false` | 모든 컬럼에 정렬 활성화 |

---

## 정렬값 표기

| 표기 | 의미 |
|---|---|
| `L` 또는 `left` | 왼쪽 정렬 |
| `C` 또는 `center` | 가운데 정렬 |
| `R` 또는 `right` | 오른쪽 정렬 |

**단일값**: 모든 열에 동일 적용
```
bodyAlign="C"        → 전체 내용 가운데
```

**콤마 구분**: 열별 개별 지정, 초과분은 마지막 값 사용
```
bodyAlign="L,C,R"    → 1열 왼쪽, 2열 가운데, 3열 이상 오른쪽
```

---

## colSize 값 표기

**px 고정값만 지원** (`fr`, `auto`는 무시 → 브라우저 자동 너비)

| 표기 | 의미 |
|---|---|
| `80` | 고정 80px |
| `120` | 고정 120px |
| 생략 또는 비숫자 | 브라우저 자동 너비 |

```markdown
colSize: 80,120,200         → 1열 80px, 2열 120px, 3열 이상 200px
colSize: 100                → 전체 열 100px
```

> `fr` 단위가 필요한 경우 `XlsxTable` 컴포넌트를 사용하세요.

---

## 사용 예시

### 기본

```markdown
:x-data-table{file="report"}
```

### CSV 파일

```markdown
:x-data-table{file="data.csv"}
```

### 특정 시트 + 정렬 활성화

```markdown
:x-data-table{file="budget.xlsx" tab="Q1" sortable}
```

### 열 너비 + 정렬 지정

```markdown
::x-data-table
---
file: sample.xlsx
tab: Sheet1
colSize: 80,120,120,300
bodyAlign: L,L,C,R
headerAlign: C,C,C,C
sortable: true
---
::
```

### 헤더 2행

```markdown
::x-data-table
---
file: matrix.xlsx
tab: Sheet1
headerRows: 2
---
::
```

### class로 너비 제한

```markdown
::x-data-table
---
file: report.xlsx
class: max-w-3xl mx-auto
---
::
```

---

## XlsxTable과 비교

| 기능 | XlsxTable | XDataTable |
|---|---|---|
| fr 단위 열 너비 | ✅ | ❌ (px만) |
| 컬럼 정렬(sort) | ❌ | ✅ |
| 열 리사이즈 | ✅ | ❌ |
| 셀 병합 (rowspan/colspan) | ✅ | ❌ |
| 좌측 고정 열 | ❌ (제거됨) | ❌ |
| 페이지네이션 | ❌ | VoltDataTable 기본 지원 |

---

## 주의사항

- **셀 병합 미지원**: Excel 병합 셀은 skip 처리되어 빈 셀로 표시됨
- **colSize fr 미지원**: `1fr`, `2fr` 등은 무시됨 → 빈 값으로 처리
- **tab 불일치**: 존재하지 않는 시트명 지정 시 빨간 에러 메시지 표시

---

## 관련 파일

| 파일 | 역할 |
|---|---|
| `app/components/content/XDataTable.vue` | MDC 컴포넌트 |
| `app/components/volt/DataTable.vue` | PrimeVue DataTable 래퍼 |
| `server/api/xlsx/index.get.ts` | XLSX/CSV 파싱 API |
| `public/xlsx/` | 데이터 파일 저장 위치 |
