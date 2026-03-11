import { useState } from 'react'
import { TimePicker } from 'antd'
import type { Dayjs } from 'dayjs'
import { ValueDisplay } from '../ValueDisplay'

export function AntdTimeInput() {
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
          style={{ width: '100%' }}
        />
        <ValueDisplay value={sendValue('default')} />
      </div>

      <div>
        <label style={labelStyle}>秒まで（HH:mm:ss）</label>
        <TimePicker
          format="HH:mm:ss"
          value={values['seconds'] ?? null}
          onChange={handleChange('seconds')}
          style={{ width: '100%' }}
        />
        <ValueDisplay value={sendValue('seconds')} />
      </div>

      <div>
        <label style={labelStyle}>12時間制（AM/PM）</label>
        <TimePicker
          format="hh:mm A"
          use12Hours
          value={values['ampm'] ?? null}
          onChange={handleChange('ampm')}
          style={{ width: '100%' }}
        />
        <ValueDisplay value={sendValue('ampm')} />
      </div>

      <div>
        <label style={labelStyle}>手入力のみ（ピッカーなし）</label>
        <TimePicker
          format="HH:mm"
          value={values['noPopup'] ?? null}
          onChange={handleChange('noPopup')}
          open={false}
          style={{ width: '100%' }}
        />
        <ValueDisplay value={sendValue('noPopup')} />
      </div>

      <div>
        <label style={labelStyle}>15分刻み</label>
        <TimePicker
          format="HH:mm"
          minuteStep={15}
          value={values['step15'] ?? null}
          onChange={handleChange('step15')}
          style={{ width: '100%' }}
        />
        <ValueDisplay value={sendValue('step15')} />
      </div>

      <div>
        <label style={labelStyle}>30分刻み</label>
        <TimePicker
          format="HH:mm"
          minuteStep={30}
          value={values['step30'] ?? null}
          onChange={handleChange('step30')}
          style={{ width: '100%' }}
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
