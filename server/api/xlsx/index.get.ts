import { readFile } from 'fs/promises'
import * as path from 'path'
import * as XLSX from 'xlsx'

export type CellData = {
  value: string | null
  rowspan: number
  colspan: number
  skip: boolean
}

export type SheetData = {
  rows: CellData[][]
}

function parseSheet(ws: XLSX.WorkSheet): SheetData {
  const ref = ws['!ref']
  if (!ref) return { rows: [] }

  const range = XLSX.utils.decode_range(ref)
  const merges = ws['!merges'] ?? []

  // Build span map keyed by "r,c"
  const spanMap = new Map<string, { rowspan: number; colspan: number; skip: boolean }>()

  for (const merge of merges) {
    const { s, e } = merge
    spanMap.set(`${s.r},${s.c}`, {
      rowspan: e.r - s.r + 1,
      colspan: e.c - s.c + 1,
      skip: false,
    })
    for (let r = s.r; r <= e.r; r++) {
      for (let c = s.c; c <= e.c; c++) {
        if (r === s.r && c === s.c) continue
        spanMap.set(`${r},${c}`, { rowspan: 1, colspan: 1, skip: true })
      }
    }
  }

  const rows: CellData[][] = []
  for (let r = range.s.r; r <= range.e.r; r++) {
    const row: CellData[] = []
    for (let c = range.s.c; c <= range.e.c; c++) {
      const span = spanMap.get(`${r},${c}`)
      if (span?.skip) {
        row.push({ value: null, rowspan: 1, colspan: 1, skip: true })
        continue
      }
      const cellAddr = XLSX.utils.encode_cell({ r, c })
      const cell = ws[cellAddr]
      row.push({
        value: cell ? (cell.w ?? (cell.v != null ? String(cell.v) : null)) : null,
        rowspan: span?.rowspan ?? 1,
        colspan: span?.colspan ?? 1,
        skip: false,
      })
    }
    rows.push(row)
  }

  return { rows }
}

/**
 * CSV 전용: 인접한 동일 값 셀을 자동으로 병합.
 * 1단계(가로): 같은 행에서 연속된 동일 값 → colspan
 * 2단계(세로): 같은 열에서 연속된 동일 값 + 동일 colspan → rowspan
 */
function autoMergeRows(rows: CellData[][]): void {
  if (rows.length === 0) return
  const numRows = rows.length
  const numCols = rows[0].length

  // 1단계: 가로 병합 (colspan)
  for (let r = 0; r < numRows; r++) {
    let c = 0
    while (c < numCols) {
      const cell = rows[r][c]
      if (cell.skip || !cell.value) { c++; continue }
      let span = 1
      while (
        c + span < numCols &&
        !rows[r][c + span].skip &&
        rows[r][c + span].value === cell.value
      ) {
        rows[r][c + span].skip = true
        span++
      }
      cell.colspan = span
      c += span
    }
  }

  // 2단계: 세로 병합 (rowspan) — colspan이 같은 셀끼리만
  for (let c = 0; c < numCols; c++) {
    let r = 0
    while (r < numRows) {
      const cell = rows[r][c]
      if (cell.skip || !cell.value) { r++; continue }
      let span = 1
      while (
        r + span < numRows &&
        !rows[r + span][c].skip &&
        rows[r + span][c].value === cell.value &&
        rows[r + span][c].colspan === cell.colspan
      ) {
        rows[r + span][c].skip = true
        span++
      }
      cell.rowspan = span
      r += span
    }
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const fileParam = query.file as string

  if (!fileParam) {
    throw createError({ statusCode: 400, statusMessage: 'file param required' })
  }

  // Security: prevent path traversal
  const basename = path.basename(fileParam)
  const filename = /\.(xlsx|xls|csv)$/i.test(basename) ? basename : `${basename}.xlsx`

  const filePath = path.join(process.cwd(), 'public', 'xlsx', filename)

  const buffer = await readFile(filePath).catch(() => {
    throw createError({ statusCode: 404, statusMessage: `${filename} not found` })
  })

  let workbook: XLSX.WorkBook
  if (/\.csv$/i.test(filename)) {
    // CSV: read as UTF-8 string (handles BOM, quoted fields, different line endings)
    const text = buffer.toString('utf-8')
    workbook = XLSX.read(text, { type: 'string' })
    // Use filename (without extension) as the sheet display name
    const sheetDisplayName = basename.replace(/\.csv$/i, '')
    const originalName = workbook.SheetNames[0]
    if (originalName !== sheetDisplayName) {
      workbook.Sheets[sheetDisplayName] = workbook.Sheets[originalName]
      delete workbook.Sheets[originalName]
      workbook.SheetNames[0] = sheetDisplayName
    }
  } else {
    workbook = XLSX.read(buffer, { type: 'buffer' })
  }

  const isCsv = /\.csv$/i.test(filename)
  const sheets = workbook.SheetNames
  const data: Record<string, SheetData> = {}

  for (const sheetName of sheets) {
    data[sheetName] = parseSheet(workbook.Sheets[sheetName])
    if (isCsv) autoMergeRows(data[sheetName].rows)
  }

  return { sheets, data }
})
