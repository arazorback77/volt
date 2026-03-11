<template>
  <div :class="wrapperClass">
    <!-- Loading -->
    <div v-if="pending" class="py-8 text-center text-sm text-surface-400">
      Loading {{ fileName }}…
    </div>

    <!-- Error -->
    <div v-else-if="displayError" class="py-3 px-4 text-sm text-red-500">
      {{ displayError }}
    </div>

    <!-- Data -->
    <div v-else-if="xlsxData" class="overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
      <!-- Table -->
      <div ref="containerEl" class="overflow-x-auto overflow-y-hidden">
        <table
          ref="tableEl"
          class="border-spacing-0 w-full border-separate text-sm table-fixed"
        >
          <!-- Column widths -->
          <colgroup>
            <col v-for="i in numCols" :key="i" :style="getColStyle(i - 1)">
          </colgroup>

          <thead>
            <tr v-for="(row, ri) in headerRowsData" :key="ri">
              <template v-for="(cell, ci) in row" :key="ci">
                <th
                  v-if="!cell.skip"
                  :rowspan="cell.rowspan > 1 ? cell.rowspan : undefined"
                  :colspan="cell.colspan > 1 ? cell.colspan : undefined"
                  :class="[
                    'py-3 px-4 font-semibold border-b border-r last:border-r-0',
                    'border-surface-200 dark:border-surface-700',
                    'bg-surface-100 dark:bg-surface-800',
                    'text-surface-700 dark:text-surface-0',
                    'truncate max-w-0 sticky top-0 z-10',
                    headerAlignClass(ci),
                  ]"
                  :title="cell.value ?? ''"
                >
                  {{ cell.value ?? '' }}
                </th>
              </template>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(row, ri) in bodyRowsData"
              :key="ri"
              class="bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-200"
            >
              <template v-for="(cell, ci) in row" :key="ci">
                <td
                  v-if="!cell.skip"
                  :rowspan="cell.rowspan > 1 ? cell.rowspan : undefined"
                  :colspan="cell.colspan > 1 ? cell.colspan : undefined"
                  :class="[
                    'py-3 px-4 border-b border-r last:border-r-0 truncate max-w-0',
                    'border-surface-200 dark:border-surface-800',
                    bodyAlignClass(ci),
                  ]"
                  :title="cell.value ?? ''"
                >
                  {{ cell.value ?? '' }}
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Prevent auto-fallthrough so we can manually control where $attrs.class is applied
defineOptions({ inheritAttrs: false })

type CellData = { value: string | null; rowspan: number; colspan: number; skip: boolean }
type Align = 'left' | 'center' | 'right'

const props = withDefaults(defineProps<{
  /** XLSX/CSV filename in /public/xlsx/ */
  file: string
  /** Sheet name to display (defaults to first sheet) */
  tab?: string
  /**
   * Header row count.
   * These rows render as <th> with shaded background.
   * @default 1
   */
  headerRows?: number
  /**
   * Header row cell alignments, comma-separated.
   * Single value applies to all columns. Per-column: "C,C,R,R"
   * Values: L/left | C/center | R/right
   * @default "C"  (all center)
   */
  headerAlign?: string
  /**
   * Body row cell alignments, comma-separated.
   * Single value applies to all columns. Per-column: "L,L,R,R"
   * Values: L/left | C/center | R/right
   * @default "L"  (all left)
   */
  bodyAlign?: string
  /**
   * Column widths, comma-separated.
   * Single value applies to all columns. Per-column: "80,1fr,2fr,120"
   * Values: pixel number | Nfr (weighted flex share) | auto
   * "1fr,2fr,3fr" → 1:2:3 split of remaining space (CSS Grid fr semantics).
   * Uses table-layout:fixed — fr columns share leftover space by weight.
   * @default "1fr"  (all columns equal weight)
   */
  colSize?: string
  /**
   * Auto-size columns to fit content on initial load.
   * Measures each cell's text width via Canvas API and sets proportional % widths.
   * Columns with explicit col-size px values are not affected.
   * @default false
   */
  autoFit?: boolean
}>(), {
  headerRows:  1,
  headerAlign: 'C',
  bodyAlign:   'L',
  colSize:     '1fr',
})

// ── wrapper class ─────────────────────────────────────────────────────────────

const attrs = useAttrs()

/**
 * Merge base class with $attrs.class from MDC.
 * YAML may produce comma-separated values (e.g. "max-w-2xl, p-10");
 * commas are stripped so all tokens are treated as space-separated class names.
 */
const wrapperClass = computed(() => {
  const base = 'my-4'
  const extra = attrs.class
  if (!extra) return base
  // Normalise: join arrays, strip commas, collapse whitespace
  const raw = Array.isArray(extra) ? extra.join(' ') : String(extra)
  const cleaned = raw.replace(/,/g, ' ').replace(/\s+/g, ' ').trim()
  return cleaned ? `${base} ${cleaned}` : base
})

// ── fetch ─────────────────────────────────────────────────────────────────────

const fileName = computed(() => {
  const f = props.file.trim()
  return /\.(xlsx|xls|csv)$/i.test(f) ? f : `${f}.xlsx`
})

const { data: xlsxData, pending, error } = await useFetch<{
  sheets: string[]
  data: Record<string, { rows: CellData[][] }>
}>('/api/xlsx', { query: { file: fileName } })

const tabError = computed<string | null>(() => {
  if (!props.tab) return null
  const sheets = xlsxData.value?.sheets ?? []
  if (sheets.length > 0 && !sheets.includes(props.tab))
    return `Sheet "${props.tab}" not found in ${props.file}. Available: ${sheets.join(', ')}`
  return null
})

const displayError = computed<string | null>(() => {
  if (error.value) return error.value.statusMessage || error.value.message || null
  return tabError.value
})

const activeTab = computed(() => {
  const sheets = xlsxData.value?.sheets ?? []
  return props.tab ?? sheets[0] ?? ''
})

const currentRows    = computed(() => xlsxData.value?.data[activeTab.value]?.rows ?? [])
const headerRowsData = computed(() => currentRows.value.slice(0, props.headerRows))
const bodyRowsData   = computed(() => currentRows.value.slice(props.headerRows))
const numCols        = computed(() => currentRows.value[0]?.length ?? 0)

// ── column widths ─────────────────────────────────────────────────────────────

/**
 * Parse a single colSize token → { kind, value }.
 *
 * Supported notations (both produce the same result):
 *   "1fr" / "2fr" / "3fr"  — CSS Grid–style fraction (recommended in MDC)
 *    "120"                  — fixed px
 *   "auto"                 — browser auto width
 */
function parseColToken(raw: string): { isPx: boolean; px: number | null; weight: number | null } {
  const v = raw.trim()
  // fr notation: "1fr", "2fr", "0.5fr", etc.
  const frMatch = v.match(/^(\d+(?:\.\d+)?)fr$/i)
  if (frMatch) return { isPx: false, px: null, weight: parseFloat(frMatch[1]!) }
    // auto / empty
  if (v === 'auto' || v === '') return { isPx: false, px: null, weight: null }
  // fixed px
  const n = parseInt(v)
  if (!isNaN(n)) return { isPx: true, px: n, weight: null }
  return { isPx: false, px: null, weight: null }
}

/** Parse `colSize` prop once → array of { isPx, px, weight } tokens */
const parsedCols = computed(() =>
  (props.colSize ?? '').split(',').map(s => parseColToken(s))
)

/**
 * Effective px width for column ci.
 * Single-value colSize fans out as default for all columns.
 */
function effectiveInitialWidth(ci: number): number | null {
  const arr = parsedCols.value
  if (arr.length === 0) return null
  const token = arr[ci] ?? arr[arr.length - 1]
  return token?.px ?? null
}

/**
 * Effective star weight for column ci.
 * Default weight is 1 when colSize is not specified or is all-star.
 * Returns null for px-fixed columns.
 */
function effectiveInitialWeight(ci: number): number | null {
  // If the column has an explicit px width, it's not a star column
  if (effectiveInitialWidth(ci) !== null) return null
  const arr = parsedCols.value
  if (arr.length === 0) return 1   // no colSize → all columns default to weight 1
  const token = arr[ci] ?? arr[arr.length - 1]
  return token?.weight ?? null
}

/**
 * Auto-fit proportional widths as percentages (0–100).
 * Enables flex-like grow/shrink: columns expand/contract proportionally with the table.
 * Only set for * columns; explicit col-size px columns stay as null here.
 * Cleared per-column when the user manually resizes that column.
 */
const autoFitPcts = ref<(number | null)[]>([])

/** Scroll-container ref + its observed pixel width, updated on resize.
 *  Used to convert % column widths → px for sticky `left` offsets. */
const containerEl = ref<HTMLElement>()
const tableContainerWidth = ref(0)

/**
 * Aggregates column width info across two tiers:
 *  - totalFixed:      sum of all px-fixed widths (col-size px values)
 *  - pctSum:          sum of all auto-fit % values
 *  - totalStarWeight: sum of fr/star weights for remaining flexible columns
 *
 * Used in calc() expressions and sticky-offset calculations.
 */
const starColInfo = computed(() => {
  let totalFixed = 0
  let pctSum = 0
  let totalStarWeight = 0
  for (let i = 0; i < numCols.value; i++) {
    const px = effectiveInitialWidth(i)
    if (px != null) { totalFixed += px; continue }
    const pct = autoFitPcts.value[i]
    if (pct != null) { pctSum += pct; continue }
    totalStarWeight += effectiveInitialWeight(i) ?? 1
  }
  return { totalFixed, pctSum, totalStarWeight }
})

/** <col> style for colgroup */
function getColStyle(ci: number): string | undefined {
  // Priority 1: explicit col-size px value
  const initial = effectiveInitialWidth(ci)
  if (initial != null) return `width: ${initial}px`

  // Priority 2: auto-fit — compute px from container width using measured proportions
  const fitPct = autoFitPcts.value[ci]
  if (fitPct != null) {
    const { totalFixed, pctSum } = starColInfo.value
    const containerW = tableContainerWidth.value
    if (containerW > 0 && pctSum > 0) {
      const available = Math.max(0, containerW - totalFixed)
      const px = Math.floor(available * (fitPct / pctSum))
      return `width: ${px}px`
    }
    // SSR fallback
    const share = pctSum > 0 ? fitPct / pctSum : 0
    return `width: calc((100% - ${totalFixed}px) * ${share.toFixed(6)})`
  }

  // Priority 3: fr/star column — compute exact px from container width (cross-browser reliable).
  // CSS calc((100% - Xpx) * N/M) on <col> elements has inconsistent browser support
  // with table-layout:fixed; using JS-computed px avoids that issue entirely.
  const { totalFixed, totalStarWeight } = starColInfo.value
  const weight = effectiveInitialWeight(ci) ?? 1
  if (totalStarWeight === 0) return undefined

  const containerW = tableContainerWidth.value
  if (containerW > 0) {
    const available = Math.max(0, containerW - totalFixed)
    const px = Math.floor(available * weight / totalStarWeight)
    return `width: ${px}px`
  }

  // SSR fallback (container width unknown): use calc() — updates to px after mount
  return `width: calc((100% - ${totalFixed}px) * ${weight} / ${totalStarWeight})`
}

// ── auto-fit ──────────────────────────────────────────────────────────────────

const tableEl = ref<HTMLTableElement>()

/**
 * Measures each column's widest text (header + body) using Canvas API,
 * then sets proportional percentage widths in `autoFitPcts`.
 *
 * This gives flex-like grow/shrink behaviour:
 *   • flex-basis  — initial size proportional to content
 *   • flex-grow   — columns expand together as the table widens
 *   • flex-shrink — columns shrink together; ellipsis clips overflow text
 *
 * Only runs for fr/star columns (explicit col-size px columns are skipped).
 * Writes to `autoFitPcts` — in-memory only, never persisted.
 */
function autoFitCols() {
  if (!tableEl.value) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const style    = window.getComputedStyle(tableEl.value)
  const fontSize = style.fontSize   || '14px'
  const fontFam  = style.fontFamily || 'system-ui, sans-serif'
  const baseFont = `${fontSize} ${fontFam}`
  const boldFont = `600 ${fontSize} ${fontFam}`

  const PAD = 40   // px-4 (16px) × 2 sides + 8px breathing room
  const MIN = 60
  const MAX = 360

  const numHeader = headerRowsData.value.length
  const allRows   = currentRows.value

  // Step 1: measure ideal px width for each * column
  const pxWidths: (number | null)[] = []
  for (let ci = 0; ci < numCols.value; ci++) {
    // Skip columns that have an explicit px width in col-size prop
    if (effectiveInitialWidth(ci) !== null) {
      pxWidths.push(null)
      continue
    }

    let maxW = 0
    for (let ri = 0; ri < allRows.length; ri++) {
      const cell = allRows[ri]?.[ci]
      if (!cell || cell.skip || !cell.value) continue
      ctx.font = ri < numHeader ? boldFont : baseFont
      const tw = ctx.measureText(cell.value).width
      // Distribute width proportionally for merged cells
      const w = cell.colspan > 1 ? tw / cell.colspan : tw
      if (w > maxW) maxW = w
    }

    pxWidths.push(Math.min(MAX, Math.max(MIN, Math.ceil(maxW) + PAD)))
  }

  // Step 2: convert px measurements to percentages (proportional share of * space).
  // Percentages sum to 100 across all * columns so that together they fill
  // exactly the space left after explicit px columns — just like flex items.
  const total = pxWidths.reduce<number>((sum, w) => sum + (w ?? 0), 0)
  if (total === 0) return

  autoFitPcts.value = pxWidths.map(w =>
    w !== null ? parseFloat(((w / total) * 100).toFixed(4)) : null,
  )
  // In-memory only — recomputed on each page load.
}

// ── alignment ─────────────────────────────────────────────────────────────────

function parseAlignProp(val?: string): Align[] {
  if (!val) return []
  return val.split(',').map(a => {
    const v = a.trim().toLowerCase()
    if (v === 'c' || v === 'center') return 'center'
    if (v === 'r' || v === 'right')  return 'right'
    return 'left'
  })
}

function toClass(a: Align): string {
  return a === 'center' ? 'text-center' : a === 'right' ? 'text-right' : 'text-left'
}

/**
 * Effective align for column ci.
 * Single-value array fans out as default for all columns.
 */
function effectiveAlign(arr: Align[], ci: number): Align {
  if (arr.length === 0) return 'left'
  return arr[ci] ?? arr[arr.length - 1] ?? 'left'
}

const colAligns    = computed(() => parseAlignProp(props.bodyAlign))
const headerAligns = computed(() => parseAlignProp(props.headerAlign))

function bodyAlignClass(ci: number): string {
  return toClass(effectiveAlign(colAligns.value, ci))
}

function headerAlignClass(ci: number): string {
  return toClass(effectiveAlign(headerAligns.value, ci))
}

// ── lifecycle ─────────────────────────────────────────────────────────────────

function updateTableContainerWidth() {
  tableContainerWidth.value = containerEl.value?.getBoundingClientRect().width ?? 0
}

/**
 * ResizeObserver watches the scroll-container for ANY size change:
 * window resize, sidebar toggle, panel collapse, split-pane drag, etc.
 * This keeps fr-column px widths proportional without relying solely on
 * the `window.resize` event (which misses layout-driven width changes).
 */
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => {
    updateTableContainerWidth()
    if (props.autoFit) autoFitCols()

    if (containerEl.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateTableContainerWidth)
      resizeObserver.observe(containerEl.value)
    }
  })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>
