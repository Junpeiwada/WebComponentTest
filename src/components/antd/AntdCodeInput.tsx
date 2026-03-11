import { useState } from 'react'
import { AutoComplete } from 'antd'
import type { SelectOption } from '../../types'

/**
 * コード入力コンポーネント (Ant Design版)
 *
 * コード値を入力すると「値:ラベル」形式で自動補完・確定する。
 * - 候補が1つに絞り込まれると自動確定
 * - 確定後のバックスペースで全クリア→再入力可能
 * - blur時に未確定なら入力をクリア
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

  const acOptions = options.map((o) => ({
    label: `${o.value}:${o.label}`,
    value: `${o.value}:${o.label}`,
    numValue: o.value,
  }))

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
        // 確定済みの状態でバックスペース → 全クリアしてやり直し
        if (confirmed && val.length < input.length) {
          setInput('')
          onChange(null)
          setConfirmed(false)
          return
        }
        setInput(val)
        // 候補が1つに絞り込まれたら自動確定
        const matches = acOptions.filter(
          (o) =>
            o.label.startsWith(val) ||
            String(o.numValue).startsWith(val)
        )
        if (matches.length === 1) {
          setInput(matches[0].label)
          onChange(matches[0].numValue)
          setConfirmed(true)
        } else {
          onChange(null)
          setConfirmed(false)
        }
      }}
      onBlur={() => {
        if (!confirmed) {
          setInput('')
          onChange(null)
        }
      }}
    />
  )
}
