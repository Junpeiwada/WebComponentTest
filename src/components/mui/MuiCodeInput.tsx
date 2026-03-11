import { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import type { SelectOption } from '../../types'

/**
 * コード入力コンポーネント (MUI版)
 *
 * コード値を入力すると「値:ラベル」形式で自動補完・確定する。
 * - 候補が1つに絞り込まれると自動確定
 * - 確定後のバックスペースで全クリア→再入力可能
 * - blur時に未確定なら入力をクリア
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

  const format = (o: SelectOption<T>) => `${o.value}:${o.label}`

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
        // 確定済みの状態でバックスペース → 全クリアしてやり直し
        if (confirmed && newInput.length < input.length) {
          setInput('')
          onChange(null)
          setConfirmed(false)
          return
        }
        setInput(newInput)
        const matches = options.filter(
          (o) =>
            format(o).startsWith(newInput) ||
            String(o.value).startsWith(newInput)
        )
        if (matches.length === 1) {
          setInput(format(matches[0]))
          onChange(matches[0].value)
          setConfirmed(true)
        } else {
          onChange(null)
          setConfirmed(false)
        }
      }}
      onChange={(_e, val) => {
        if (val && typeof val !== 'string') {
          setInput(format(val))
          onChange(val.value)
          setConfirmed(true)
        }
      }}
      onBlur={() => {
        if (!confirmed) {
          setInput('')
          onChange(null)
        }
      }}
      renderOption={(props, option) => {
        const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: string }
        return (
          <li key={key} {...rest}>
            {option.value}:{option.label}
          </li>
        )
      }}
      renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
    />
  )
}
