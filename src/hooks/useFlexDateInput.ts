import { useState, useCallback } from 'react'
import type { Dayjs } from 'dayjs'
import { parseDateInput } from '../utils/parseDateInput'

interface UseFlexDateInputOptions {
  format?: string
  onChange?: (value: Dayjs | null, formatted: string) => void
}

export function useFlexDateInput(options: UseFlexDateInputOptions = {}) {
  const { format = 'YYYY/MM/DD', onChange } = options

  const [value, setValue] = useState<Dayjs | null>(null)
  const [text, setText] = useState('')
  const [error, setError] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const applyValue = useCallback(
    (d: Dayjs | null) => {
      setValue(d)
      setError(false)
      const formatted = d?.isValid() ? d.format(format) : ''
      setText(formatted)
      onChange?.(d, formatted)
    },
    [format, onChange]
  )

  const handleTextChange = useCallback((raw: string) => {
    setText(raw)
    if (error) setError(false)
  }, [error])

  const handleCommit = useCallback(() => {
    if (!text.trim()) {
      applyValue(null)
      return
    }
    const parsed = parseDateInput(text)
    if (parsed) {
      applyValue(parsed)
    } else {
      setError(true)
      onChange?.(null, '')
    }
  }, [text, applyValue, onChange])

  const handlePickerChange = useCallback(
    (d: Dayjs | null) => {
      if (d?.isValid()) {
        applyValue(d)
      }
      setPickerOpen(false)
    },
    [applyValue]
  )

  const openPicker = useCallback(() => setPickerOpen(true), [])
  const closePicker = useCallback(() => setPickerOpen(false), [])

  return {
    value,
    text,
    error,
    pickerOpen,
    setText: handleTextChange,
    commit: handleCommit,
    openPicker,
    closePicker,
    onPickerChange: handlePickerChange,
  }
}
