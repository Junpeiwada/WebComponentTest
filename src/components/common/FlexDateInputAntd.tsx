import { useRef } from 'react'
import { DatePicker, Input } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import { useFlexDateInput } from '../../hooks/useFlexDateInput'

interface FlexDateInputAntdProps {
  format?: string
  placeholder?: string
  disabled?: boolean
  minDate?: Dayjs
  maxDate?: Dayjs
  onChange?: (value: Dayjs | null, formatted: string) => void
}

export function FlexDateInputAntd({
  format,
  placeholder = '例: 0101, 250203, 20260101, 1/1, 25/7/4',
  disabled,
  minDate,
  maxDate,
  onChange,
}: FlexDateInputAntdProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { value, text, error, pickerOpen, setText, commit, openPicker, closePicker, onPickerChange } =
    useFlexDateInput({ format, onChange })

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Input
        disabled={disabled}
        status={error ? 'error' : undefined}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit() }}
        suffix={
          <CalendarOutlined
            style={{ cursor: disabled ? 'default' : 'pointer', color: disabled ? '#d9d9d9' : undefined }}
            onClick={disabled ? undefined : openPicker}
          />
        }
      />
      {error && (
        <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4 }}>無効な日付です</div>
      )}
      <DatePicker
        open={pickerOpen}
        onOpenChange={(open) => { if (!open) closePicker() }}
        value={value}
        onChange={onPickerChange}
        minDate={minDate}
        maxDate={maxDate}
        tabIndex={-1}
        style={{ position: 'absolute', visibility: 'hidden', width: 0, height: 0, top: 0, left: 0 }}
        getPopupContainer={() => containerRef.current!}
      />
    </div>
  )
}
