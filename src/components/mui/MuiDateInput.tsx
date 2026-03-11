import { useState, useCallback } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { type Dayjs } from 'dayjs'
import { ValueDisplay } from '../ValueDisplay'
import { FlexDateInputMui } from '../common/FlexDateInputMui'

export function MuiDateInput() {
  const [values, setValues] = useState<Record<string, Dayjs | null>>({})

  const handleChange = (key: string) => (val: Dayjs | null) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const sendValue = (key: string) => {
    const v = values[key]
    return v?.isValid() ? v.format('YYYY-MM-DD') : null
  }

  const handleFlexChange = useCallback((val: Dayjs | null) => {
    setValues((prev) => ({ ...prev, raw: val }))
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={labelStyle}>&#x2699; 柔軟な日付入力（0101, 250203, 1/1, 25/7/4, 2026/8/9 等）<span style={{ color: 'darkgreen' }}>【独自実装】</span></label>
        <FlexDateInputMui onChange={handleFlexChange} />
        <ValueDisplay value={sendValue('raw')} />
        <p style={{ fontSize: 11, color: '#999', margin: '4px 0 0' }}>
          手入力 or カレンダーから選択（フォーカスを外す or Enterで変換）
        </p>
      </div>

      <div>
        <label style={labelStyle}>カレンダーあり（YYYY/MM/DD）</label>
        <DatePicker
          format="YYYY/MM/DD"
          value={values['default'] ?? null}
          onChange={handleChange('default')}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('default')} />
      </div>

      <div>
        <label style={labelStyle}>カレンダーなし（手入力のみ）</label>
        <DatePicker
          format="YYYY/MM/DD"
          value={values['noCalendar'] ?? null}
          onChange={handleChange('noCalendar')}
          slots={{ openPickerButton: () => null }}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('noCalendar')} />
      </div>

      <div>
        <label style={labelStyle}>YYYY-MM-DD フォーマット</label>
        <DatePicker
          format="YYYY-MM-DD"
          value={values['hyphen'] ?? null}
          onChange={handleChange('hyphen')}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('hyphen')} />
      </div>

      <div>
        <label style={labelStyle}>YYYY年MM月DD日 フォーマット</label>
        <DatePicker
          format="YYYY年MM月DD日"
          value={values['jp'] ?? null}
          onChange={handleChange('jp')}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('jp')} />
      </div>

      <div>
        <label style={labelStyle}>範囲制限付き（2026/01/01 〜 2026/12/31）</label>
        <DatePicker
          format="YYYY/MM/DD"
          value={values['range'] ?? null}
          onChange={handleChange('range')}
          minDate={dayjs('2026-01-01')}
          maxDate={dayjs('2026-12-31')}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('range')} />
      </div>

      <div>
        <label style={labelStyle}>初期値あり（今日）</label>
        <DatePicker
          format="YYYY/MM/DD"
          value={values['initial'] ?? dayjs()}
          onChange={handleChange('initial')}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('initial') ?? dayjs().format('YYYY-MM-DD')} />
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  marginBottom: 4,
  color: '#333',
}
