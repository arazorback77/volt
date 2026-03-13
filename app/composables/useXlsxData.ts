/**
 * Shared composable for XLSX/CSV MDC components (XlsxTable, XDataTable).
 * Handles: wrapperClass, fileName, data fetching, tab validation, alignment parsing.
 */

export type CellData = { value: string | null; rowspan: number; colspan: number; skip: boolean }
export type Align = 'left' | 'center' | 'right'

// ── Alignment helpers (pure functions, exported for component use) ─────────────

export function parseAlignProp(val?: string): Align[] {
  if (!val) return []
  return val.split(',').map(a => {
    const v = a.trim().toLowerCase()
    if (v === 'c' || v === 'center') return 'center'
    if (v === 'r' || v === 'right')  return 'right'
    return 'left'
  })
}

export function effectiveAlign(arr: Align[], ci: number): Align {
  if (arr.length === 0) return 'left'
  return arr[ci] ?? arr[arr.length - 1] ?? 'left'
}

// ── Main composable ────────────────────────────────────────────────────────────

export async function useXlsxData(
  props: { file: string; tab?: string },
  attrs: ReturnType<typeof useAttrs>
) {
  // ── Wrapper class (merges base + MDC $attrs.class, normalising commas) ────────
  const wrapperClass = computed(() => {
    const base = 'my-4'
    const extra = attrs.class
    if (!extra) return base
    const raw = Array.isArray(extra) ? extra.join(' ') : String(extra)
    const cleaned = raw.replace(/,/g, ' ').replace(/\s+/g, ' ').trim()
    return cleaned ? `${base} ${cleaned}` : base
  })

  // ── File name (add .xlsx extension if omitted) ────────────────────────────────
  const fileName = computed(() => {
    const f = props.file.trim()
    return /\.(xlsx|xls|csv)$/i.test(f) ? f : `${f}.xlsx`
  })

  // ── Fetch ─────────────────────────────────────────────────────────────────────
  const { data: xlsxData, pending, error } = await useFetch<{
    sheets: string[]
    data: Record<string, { rows: CellData[][] }>
  }>('/api/xlsx', { query: { file: fileName } })

  // ── Tab validation ────────────────────────────────────────────────────────────
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

  // ── Active tab (falls back to first sheet) ────────────────────────────────────
  const activeTab = computed(() => {
    const sheets = xlsxData.value?.sheets ?? []
    return props.tab ?? sheets[0] ?? ''
  })

  return { wrapperClass, fileName, xlsxData, pending, error, displayError, activeTab }
}
