import { useState, useRef } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import type { SelectOption } from '../../types'

/**
 * コード入力コンポーネント (MUI版)
 *
 * コード値を入力すると「値:ラベル」形式で自動補完する。
 * - ドロップダウンから選択で確定
 * - blur時に候補が1つなら自動確定、それ以外はクリア
 * - 確定後のバックスペースで全クリア→再入力可能
 */
export function MuiCodeInput<T extends number | string>({
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

  const format = (o: SelectOption<T>) => `${o.value}:${o.label}`

  const tryConfirm = () => {
    if (confirmedRef.current) return
    const val = inputRef.current
    if (!val) return
    const matches = options.filter(
      (o) =>
        String(o.value).startsWith(val) ||
        format(o).startsWith(val) ||
        o.label.includes(val)
    )
    if (matches.length === 0) {
      setInput('')
      onChange(null)
      setConfirmed(false)
      return
    }
    // 完全一致するvalue値があれば優先、なければ最初の候補
    const exact = matches.find((o) => String(o.value) === val)
    const pick = exact ?? matches[0]
    setInput(format(pick))
    onChange(pick.value)
    setConfirmed(true)
  }

  return (
    <Autocomplete
      size="small"
      freeSolo
      options={options}
      getOptionLabel={(opt) => {
        if (typeof opt === 'string') return opt
        return format(opt)
      }}
      filterOptions={(opts, state) => {
        const v = state.inputValue
        return opts.filter(
          (o) => String(o.value).startsWith(v) || o.label.includes(v)
        )
      }}
      inputValue={input}
      onInputChange={(_e, newInput, reason) => {
        if (reason === 'reset') return
        if (!newInput) {
          setInput('')
          onChange(null)
          setConfirmed(false)
          return
        }
        // 確定済みの状態でバックスペース/Delete → 全クリアしてやり直し
        if (confirmed && (lastKeyRef.current === 'Backspace' || lastKeyRef.current === 'Delete')) {
          setInput('')
          onChange(null)
          setConfirmed(false)
          return
        }
        setInput(newInput)
        setConfirmed(false)
      }}
      onChange={(_e, val) => {
        if (val && typeof val !== 'string') {
          setInput(format(val))
          onChange(val.value)
          setConfirmed(true)
        }
      }}
      onBlur={tryConfirm}
      renderOption={(props, option) => {
        const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: string }
        return (
          <li key={key} {...rest}>
            {option.value}:{option.label}
          </li>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => { lastKeyRef.current = e.key }}
        />
      )}
    />
  )
}
