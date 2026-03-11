import dayjs, { type Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

/**
 * 柔軟な日付パーサー
 *
 * 数字のみ（区切りなし）:
 *   4桁: MMDD → 今年の月日        例: 0101 → 2026/01/01
 *   6桁: YYMMDD → 20YY年の月日    例: 250203 → 2025/02/03
 *   8桁: YYYYMMDD                  例: 20260101 → 2026/01/01
 *
 * 区切りあり（/ または -）:
 *   M/D → 今年                     例: 1/1 → 2026/01/01
 *   YY/M/D → 20YY年               例: 25/7/4 → 2025/07/04
 *   YYYY/M/D                       例: 2026/8/9 → 2026/08/09
 *
 * 2桁年の解釈: 常に 2000年代（20XX）
 */
export function parseDateInput(raw: string): Dayjs | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const currentYear = dayjs().year()

  // 区切り文字があるか判定
  const sep = trimmed.includes('/') ? '/' : trimmed.includes('-') ? '-' : null

  if (sep) {
    return parseWithSeparator(trimmed, sep, currentYear)
  }

  // 数字のみ
  const digits = trimmed.replace(/\D/g, '')
  if (digits !== trimmed) return null // 数字以外の文字が混ざっている

  return parseDigitsOnly(digits, currentYear)
}

function parseDigitsOnly(digits: string, currentYear: number): Dayjs | null {
  switch (digits.length) {
    case 4: {
      // MMDD → 今年
      const month = parseInt(digits.slice(0, 2), 10)
      const day = parseInt(digits.slice(2, 4), 10)
      return buildDate(currentYear, month, day)
    }
    case 6: {
      // YYMMDD → 20YY年
      const year = 2000 + parseInt(digits.slice(0, 2), 10)
      const month = parseInt(digits.slice(2, 4), 10)
      const day = parseInt(digits.slice(4, 6), 10)
      return buildDate(year, month, day)
    }
    case 8: {
      // YYYYMMDD
      const year = parseInt(digits.slice(0, 4), 10)
      const month = parseInt(digits.slice(4, 6), 10)
      const day = parseInt(digits.slice(6, 8), 10)
      return buildDate(year, month, day)
    }
    default:
      return null
  }
}

function parseWithSeparator(input: string, sep: string, currentYear: number): Dayjs | null {
  const parts = input.split(sep).map((s) => s.trim())

  if (parts.length === 2) {
    // M/D → 今年
    const month = parseInt(parts[0], 10)
    const day = parseInt(parts[1], 10)
    return buildDate(currentYear, month, day)
  }

  if (parts.length === 3) {
    const yearPart = parts[0]
    const month = parseInt(parts[1], 10)
    const day = parseInt(parts[2], 10)

    let year: number
    if (yearPart.length <= 2) {
      // YY/M/D → 20YY
      year = 2000 + parseInt(yearPart, 10)
    } else {
      // YYYY/M/D
      year = parseInt(yearPart, 10)
    }

    return buildDate(year, month, day)
  }

  return null
}

function buildDate(year: number, month: number, day: number): Dayjs | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const d = dayjs(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`, 'YYYY-MM-DD', true)
  return d.isValid() ? d : null
}
