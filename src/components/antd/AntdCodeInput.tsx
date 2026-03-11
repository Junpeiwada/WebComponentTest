import { useState, useRef } from 'react'
import { AutoComplete } from 'antd'
import type { SelectOption } from '../../types'

/**
 * コード入力コンポーネント (Ant Design版)
 *
 * コード値を入力すると「値:ラベル」形式で自動補完する。
 * - ドロップダウンから選択で確定
 * - blur時に候補が1つなら自動確定、それ以外はクリア
 * - 確定後のバックスペースで全クリア→再入力可能
 */
export function AntdCodeInput<T extends number | string>({
  options,
  placeholder,
  onChange,
}: {
  options: SelectOption<T>[]
  placeholder?: string
  onChange: (value: T | null) => void
}) {
  const [input, setInput] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const inputRef = useRef(input)
  inputRef.current = input
  const confirmedRef = useRef(confirmed)
  confirmedRef.current = confirmed
  const lastKeyRef = useRef('')

  const acOptions = options.map((o) => ({
    label: `${o.value}:${o.label}`,
    value: `${o.value}:${o.label}`,
    numValue: o.value,
  }))

  const tryConfirm = () => {
    if (confirmedRef.current) return
    const val = inputRef.current
    if (!val) return
    const matches = acOptions.filter(
      (o) =>
        String(o.numValue).startsWith(val) ||
        o.label.includes(val)
    )
    if (matches.length === 0) {
      setInput('')
      onChange(null)
      setConfirmed(false)
      return
    }
    // 完全一致するvalue値があれば優先、なければ最初の候補
    const exact = matches.find((o) => String(o.numValue) === val)
    const pick = exact ?? matches[0]
    setInput(pick.label)
    onChange(pick.numValue)
    setConfirmed(true)
  }

  return (
    <AutoComplete
      style={{ width: '100%' }}
      placeholder={placeholder}
      value={input}
      options={acOptions}
      filterOption={(inputVal, option) => {
        if (!option) return false
        return (
          String(option.numValue).startsWith(inputVal) ||
          option.label.includes(inputVal)
        )
      }}
      onChange={(val) => {
        if (!val) {
          setInput('')
          onChange(null)
          setConfirmed(false)
          return
        }
        // ドロップダウンから選択した場合
        const selectedOpt = acOptions.find((o) => o.value === val)
        if (selectedOpt) {
          setInput(val)
          onChange(selectedOpt.numValue)
          setConfirmed(true)
          return
        }
        // 確定済みの状態でバックスペース/Delete → 全クリアしてやり直し
        if (confirmed && (lastKeyRef.current === 'Backspace' || lastKeyRef.current === 'Delete')) {
          setInput('')
          onChange(null)
          setConfirmed(false)
          return
        }
        setInput(val)
        setConfirmed(false)
      }}
      onKeyDown={(e) => { lastKeyRef.current = e.key }}
      onBlur={tryConfirm}
      onFocus={(e) => (e.target as HTMLInputElement).select?.()}
    />
  )
}
