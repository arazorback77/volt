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

    <!-- Table -->
    <VoltDataTable
      v-else-if="tableData"
      :value="tableData.rows"
      row-hover
    >
      <Column
        v-for="col in tableData.columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :style="colWidthStyle(col.index)"
        :header-style="headerAlignStyle(col.index)"
        :body-style="bodyAlignStyle(col.index)"
        :sortable="sortable"
      />
    </VoltDataTable>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import Column from 'primevue/column'

type CellData = { value: string | null; rowspan: number; colspan: number; skip: boolean }
type Align = 'left' | 'center' | 'right'
type ColDef = { field: string; header: string; index: number }
type Row = Record<string, string | null>

const props = withDefaults(defineProps<{
  /** XLSX/CSV filename in /public/xlsx/ */
  file: string
  /** Sheet name (defaults to first sheet) */
  tab?: string
  /**
   * Header row count. The last header row defines column labels.
   * @default 1
   */
  headerRows?: number
  /**
   * Header cell alignment, comma-separated (L/C/R per column).
   * Single value applies to all columns.
   * @default "C"
   */
  headerAlign?: string
  /**
   * Body cell alignment, comma-separated (L/C/R per column).
   * Single value applies to all columns.
   * @default "L"
   */
  bodyAlign?: string
  /**
   * Column widths (px), comma-separated. e.g. "80,120,200"
   * Non-numeric values (fr, auto) → browser auto-width.
   */
  colSize?: string
  /**
   * Enable sorting on all columns.
   * @default false
   */
  sortable?: boolean
}>(), {
  headerRows:  1,
  headerAlign: 'C',
  bodyAlign:   'L',
  sortable:    false,
})

// ── wrapper class ──────────────────────────────────────────────────────────────

const attrs = useAttrs()

const wrapperClass = computed(() => {
  const base = 'my-4'
  const extra = attrs.class
  if (!extra) return base
  const raw = Array.isArray(extra) ? extra.join(' ') : String(extra)
  const cleaned = raw.replace(/,/g, ' ').replace(/\s+/g, ' ').trim()
  return cleaned ? `${base} ${cleaned}` : base
})

// ── fetch ──────────────────────────────────────────────────────────────────────

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

// ── data transformation ────────────────────────────────────────────────────────

const tableData = computed((): { columns: ColDef[]; rows: Row[] } | null => {
  if (!xlsxData.value) return null

  const allRows = xlsxData.value.data[activeTab.value]?.rows ?? []
  if (!allRows.length) return null

  // Use the last header row for column label definitions
  const headerRow = allRows[Math.max(0, props.headerRows - 1)] ?? []

  const columns: ColDef[] = headerRow
    .map((cell, i) => ({ cell, i }))
    .filter(({ cell }) => !cell.skip)
    .map(({ cell, i }) => ({
      field:  `_c${i}`,
      header: cell.value ?? '',
      index:  i,
    }))

  const rows: Row[] = allRows.slice(props.headerRows).map(row => {
    const obj: Row = {}
    row.forEach((cell, i) => {
      if (!cell.skip) obj[`_c${i}`] = cell.value
    })
    return obj
  })

  return { columns, rows }
})

// ── column widths ──────────────────────────────────────────────────────────────

const colPxWidths = computed((): (number | null)[] => {
  if (!props.colSize) return []
  return props.colSize.split(',').map(s => {
    const n = parseInt(s.trim())
    return isNaN(n) ? null : n
  })
})

function colWidthStyle(ci: number): Record<string, string> | undefined {
  const arr = colPxWidths.value
  if (!arr.length) return undefined
  const px = arr[ci] ?? arr[arr.length - 1]
  return px != null ? { width: `${px}px`, minWidth: `${px}px` } : undefined
}

// ── alignment ──────────────────────────────────────────────────────────────────

function parseAlignProp(val?: string): Align[] {
  if (!val) return []
  return val.split(',').map(a => {
    const v = a.trim().toLowerCase()
    if (v === 'c' || v === 'center') return 'center'
    if (v === 'r' || v === 'right')  return 'right'
    return 'left'
  })
}

function effectiveAlign(arr: Align[], ci: number): Align {
  if (!arr.length) return 'left'
  return arr[ci] ?? arr[arr.length - 1] ?? 'left'
}

const colAligns    = computed(() => parseAlignProp(props.bodyAlign))
const headerAligns = computed(() => parseAlignProp(props.headerAlign))

function alignStyle(ci: number, arr: Align[]): Record<string, string> | undefined {
  const a = effectiveAlign(arr, ci)
  if (a === 'center') return { textAlign: 'center' }
  if (a === 'right')  return { textAlign: 'right' }
  return undefined
}

function headerAlignStyle(ci: number) { return alignStyle(ci, headerAligns.value) }
function bodyAlignStyle(ci: number)   { return alignStyle(ci, colAligns.value) }
</script>
