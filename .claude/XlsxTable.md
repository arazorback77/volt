# XlsxTable 컴포넌트 사용 가이드

## 파일 위치

XLSX / CSV 파일은 `public/xlsx/` 디렉터리에 배치합니다.

```
public/
  xlsx/
    report.xlsx
    data.csv
    budget.xlsx
```

---

## MDC 기본 문법

```markdown
::XlsxTable{file="파일명"}
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
| `tab` | `string` | 첫 번째 시트 | 초기 활성 탭 (시트명) |
| `header-rows` | `number` | `1` | 헤더 행 수. `<th>` + 음영 처리 |
| `header-cols` | `number` | `1` | 좌측 고정(sticky) 열 수 |
| `header-align` | `string` | `"C"` | 헤더 셀 정렬. 단일값=전체 적용 |
| `body-align` | `string` | `"L"` | 내용 셀 정렬. 단일값=전체 적용 |
| `col-size` | `string` | `"1fr"` | 열 너비. `1fr`/`2fr`/`3fr`=비중 분할, px=고정. 단일값=전체 적용. `table-fixed` 자동 활성 |
| `resize` | `boolean` | `false` | 헤더 우측 핸들 드래그로 열 너비 조절 |
| `auto-fit` | `boolean` | `false` | 셀 텍스트 너비를 측정해 최적 열 너비 자동 설정 |

---

## 정렬값 표기

| 표기 | 의미 |
|---|---|
| `L` 또는 `left` | 왼쪽 정렬 |
| `C` 또는 `center` | 가운데 정렬 |
| `R` 또는 `right` | 오른쪽 정렬 |

**단일값**: 모든 열에 동일 적용
```markdown
header-align="C"        → 전체 헤더 가운데
```

**콤마 구분**: 열별 개별 지정, 초과분은 마지막 값 사용
```markdown
body-align="L,L,R,R"    → 1·2열 왼쪽, 3·4열 오른쪽
body-align="L,L,R"      → 1·2열 왼쪽, 3열 이상 오른쪽
```

---

## col-size 값 표기

| 표기 | 의미 |
|---|---|
| `1fr` | 남은 공간 1 비중 분할 (CSS Grid fr 단위와 동일) |
| `2fr` | 남은 공간 2 비중 분할 |
| `3fr` | 남은 공간 3 비중 분할 |
| `auto` | 콘텐츠 기반 자동 너비 |
| `120` | 고정 120px |

> MDC에서 `*` 파싱 오류를 피하기 위해 `fr` 표기를 권장합니다.
> 하위 호환: `*`=`1fr`, `**`=`2fr`, `***`=`3fr` 도 계속 동작합니다.

**fr 비중 규칙**: `Nfr`의 N = flex-grow 값. 비중 합계 대비 각 열의 비율로 남은 공간 분배.

```markdown
col-size="1fr"              → 전체 열 균등 분할 (기본값)
col-size="1fr,2fr"          → 1열 1/3, 2열 2/3 분할
col-size="1fr,2fr,3fr"      → 1열 1/6, 2열 2/6, 3열 3/6 분할
col-size="80,1fr,120"       → 1열 80px 고정, 2열 확장, 3열 120px
col-size="100,1fr,2fr,80"   → 1열 100px, 4열 80px 고정, 2열 남은공간 1/3, 3열 2/3
```

> `col-size` 지정 시 `table-layout: fixed` + `w-full` 자동 활성 → 반응형 레이아웃

---

## 사용 예시

### 기본 (모든 기본값 사용)
```markdown
::XlsxTable{file="report"}
::
```

### CSV 파일
```markdown
::XlsxTable{file="data.csv"}
::
```

### 특정 시트 지정 (XLSX 다중 시트)
```markdown
::XlsxTable{file="budget.xlsx" tab="Q1"}
::
```

### 열 너비 + 정렬 지정
```markdown
::XlsxTable{file="report" col-size="80,*,*,100" body-align="L,L,R,R"}
::
```

### 헤더 2행 + 좌측 고정 2열
```markdown
::XlsxTable{file="matrix.xlsx" header-rows="2" header-cols="2" col-size="100,120,*,*"}
::
```

### 컬럼 리사이즈 활성화
```markdown
::XlsxTable{file="data" resize col-size="120,*,100"}
::
```

### 헤더/내용 정렬 분리
```markdown
::XlsxTable{file="data" header-align="C" body-align="L,L,R,R,R"}
::
```

---

## class 속성 사용 예시

MDC 컴포넌트에 `class` 속성을 추가하면 루트 `<div>`에 Tailwind 클래스를 직접 적용할 수 있습니다.

### 최대 너비 제한
```markdown
::XlsxTable{file="data" class="max-w-3xl"}
::
```
> 컨테이너 너비보다 작은 표에 유용합니다.

### 가운데 정렬
```markdown
::XlsxTable{file="data" class="max-w-2xl mx-auto"}
::
```

### 그림자 추가
```markdown
::XlsxTable{file="report" class="shadow-md"}
::
```

### 상하 여백 조정
```markdown
::XlsxTable{file="data" class="my-8"}
::
```
> 기본값 `my-4`를 덮어씁니다.

### 조합 예시
```markdown
::XlsxTable{file="budget" tab="Summary" col-size="120,*,*,100" body-align="L,L,R,R" class="max-w-4xl mx-auto shadow-sm"}
::
```

### 클래스 조합 패턴

| 목적 | 클래스 |
|---|---|
| 너비 제한 (작은 표) | `max-w-sm` / `max-w-md` / `max-w-lg` / `max-w-xl` |
| 너비 제한 (중간 표) | `max-w-2xl` / `max-w-3xl` / `max-w-4xl` |
| 가운데 정렬 | `mx-auto` |
| 그림자 | `shadow-sm` / `shadow-md` / `shadow-lg` |
| 상하 여백 | `my-2` / `my-6` / `my-8` / `my-12` |
| 좌우 여백 | `mx-4` / `px-2` (페이지 패딩 조정) |

---

## localStorage 저장 키

`resize` 기능으로 조절한 열 너비는 localStorage에 자동 저장됩니다.

| 항목 | 키 형식 |
|---|---|
| 열 너비 | `xlsx-colwidths:{파일명}:{시트명}` |

---

## 셀 병합

### XLSX
Excel의 병합 셀 정보(`!merges`)를 자동 인식하여 `rowspan` / `colspan` 적용.

### CSV
인접한 동일 값을 자동 병합합니다.

1. **가로 병합**: 같은 행에서 연속된 동일 값 → `colspan`
2. **세로 병합**: 같은 열에서 연속된 동일 값 (+ 동일 colspan) → `rowspan`
3. 빈 셀은 병합 대상에서 제외

```
CSV 입력:          렌더링 결과:
A, A, B            ┌───────┬───┐
1, 2, 3            │   A   │ B │  (colspan=2)
1, 3, 4            ├───┬───┼───┤
                   │ 1 │ 2 │ 3 │
                   │   ├───┼───┤  (1열 rowspan=2)
                   │   │ 3 │ 4 │
                   └───┴───┴───┘
```

---

## 관련 파일

| 파일 | 역할 |
|---|---|
| `app/components/content/XlsxTable.vue` | MDC 컴포넌트 |
| `server/api/xlsx/index.get.ts` | XLSX/CSV 파싱 API |
| `public/xlsx/` | 데이터 파일 저장 위치 |
