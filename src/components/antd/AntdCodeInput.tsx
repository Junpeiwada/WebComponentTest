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
 * - Enterキーは消費しない（フォーカス移動用に親へ伝搬させる）
 */
export function AntdCodeInput<T extends number | string>({
  options,
  placeholder,
  onChange,
  onDropdownOpenChange,
}: {
  options: SelectOption<T>[]
  placeholder?: string
  onChange: (value: T | null) => void
  onDropdownOpenChange?: (open: boolean) => void
}) {
  const [input, setInput] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [open, setOpen] = useState(false)
  const inputRef = useRef(input)
  inputRef.current = input
  const confirmedRef = useRef(confirmed)
  confirmedRef.current = confirmed

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
    if (matches.length === 1) {
      setInput(matches[0].label)
      onChange(matches[0].numValue)
      setConfirmed(true)
    } else {
      setInput('')
      onChange(null)
      setConfirmed(false)
    }
  }

  const handleDropdownVisibleChange = (visible: boolean) => {
    // 開く方向は onSearch / onKeyDown で制御するため、閉じる時のみ反映
    if (!visible) {
      setOpen(false)
      onDropdownOpenChange?.(false)
    }
  }

  return (
    <AutoComplete
      style={{ width: '100%' }}
      placeholder={placeholder}
      value={input}
      options={acOptions}
      open={open}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          setOpen(true)
          onDropdownOpenChange?.(true)
        }
      }}
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
          setOpen(false)
          return
        }
        // 確定済みの状態でバックスペース → 全クリアしてやり直し
        if (confirmed && val.length < input.length) {
          setInput('')
          onChange(null)
          setConfirmed(false)
          return
        }
        setInput(val)
        setConfirmed(false)
      }}
      onSearch={() => {
        setOpen(true)
        onDropdownOpenChange?.(true)
      }}
      onBlur={() => {
        setOpen(false)
        tryConfirm()
      }}
      onFocus={(e) => (e.target as HTMLInputElement).select?.()}
    />
  )
}
