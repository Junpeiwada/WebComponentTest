import { useRef } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { CalendarIcon } from '@mui/x-date-pickers/icons'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import type { Dayjs } from 'dayjs'
import { useFlexDateInput } from '../../hooks/useFlexDateInput'

interface FlexDateInputMuiProps {
  format?: string
  placeholder?: string
  disabled?: boolean
  minDate?: Dayjs
  maxDate?: Dayjs
  onChange?: (value: Dayjs | null, formatted: string) => void
}

export function FlexDateInputMui({
  format,
  placeholder = '例: 0101, 250203, 20260101, 1/1, 25/7/4',
  disabled,
  minDate,
  maxDate,
  onChange,
}: FlexDateInputMuiProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { value, text, error, pickerOpen, setText, commit, openPicker, closePicker, onPickerChange } =
    useFlexDateInput({ format, onChange })

  return (
    <div style={{ position: 'relative' }}>
      <TextField
        size="small"
        fullWidth
        disabled={disabled}
        error={error}
        helperText={error ? '無効な日付です' : undefined}
        inputRef={inputRef}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit() }}
        slotProps={{
          input: {
            sx: { pr: 0.5 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" disabled={disabled} onClick={openPicker} sx={{ mr: -0.5 }}>
                  <CalendarIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <DatePicker
        open={pickerOpen}
        onClose={closePicker}
        value={value}
        onChange={onPickerChange}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            sx: { position: 'absolute', visibility: 'hidden', width: 0, height: 0 },
            tabIndex: -1,
            inputProps: { tabIndex: -1 },
          },
          popper: { anchorEl: inputRef.current },
        }}
      />
    </div>
  )
}
