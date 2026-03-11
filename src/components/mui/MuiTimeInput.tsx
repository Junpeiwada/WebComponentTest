import { useState } from 'react'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import type { Dayjs } from 'dayjs'
import { ValueDisplay } from '../ValueDisplay'

export function MuiTimeInput() {
  const [values, setValues] = useState<Record<string, Dayjs | null>>({})

  const handleChange = (key: string) => (val: Dayjs | null) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const sendValue = (key: string) => {
    const v = values[key]
    return v?.isValid() ? v.format('HH:mm:ss') : null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={labelStyle}>時刻ピッカーあり（HH:mm）</label>
        <TimePicker
          format="HH:mm"
          value={values['default'] ?? null}
          onChange={handleChange('default')}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('default')} />
      </div>

      <div>
        <label style={labelStyle}>秒まで（HH:mm:ss）</label>
        <TimePicker
          format="HH:mm:ss"
          views={['hours', 'minutes', 'seconds']}
          value={values['seconds'] ?? null}
          onChange={handleChange('seconds')}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('seconds')} />
      </div>

      <div>
        <label style={labelStyle}>12時間制（AM/PM）</label>
        <TimePicker
          format="hh:mm A"
          ampm
          value={values['ampm'] ?? null}
          onChange={handleChange('ampm')}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('ampm')} />
      </div>

      <div>
        <label style={labelStyle}>手入力のみ（ピッカーなし）</label>
        <TimePicker
          format="HH:mm"
          value={values['noPopup'] ?? null}
          onChange={handleChange('noPopup')}
          slots={{ openPickerButton: () => null }}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('noPopup')} />
      </div>

      <div>
        <label style={labelStyle}>15分刻み</label>
        <TimePicker
          format="HH:mm"
          value={values['step15'] ?? null}
          onChange={handleChange('step15')}
          minutesStep={15}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('step15')} />
      </div>

      <div>
        <label style={labelStyle}>30分刻み</label>
        <TimePicker
          format="HH:mm"
          value={values['step30'] ?? null}
          onChange={handleChange('step30')}
          minutesStep={30}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <ValueDisplay value={sendValue('step30')} />
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
