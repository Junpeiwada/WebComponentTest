import { useState } from 'react'
import { InputNumber } from 'antd'
import { ValueDisplay } from '../ValueDisplay'

export function AntdNumberInput() {
  const [values, setValues] = useState<Record<string, number | null>>({})

  const handleChange = (key: string) => (val: number | null) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={labelStyle}>カンマ区切り整数</label>
        <InputNumber
          style={{ width: '100%' }}
          value={values['comma']}
          onChange={handleChange('comma')}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => Number(value!.replace(/,/g, ''))}
        />
        <ValueDisplay value={values['comma'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>カンマ区切り + 小数点（2桁）</label>
        <InputNumber
          style={{ width: '100%' }}
          precision={2}
          value={values['decimal']}
          onChange={handleChange('decimal')}
          formatter={(value) => {
            const parts = `${value}`.split('.')
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            return parts.join('.')
          }}
          parser={(value) => Number(value!.replace(/,/g, ''))}
        />
        <ValueDisplay value={values['decimal'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>小数点のみ（カンマなし）</label>
        <InputNumber
          style={{ width: '100%' }}
          precision={2}
          value={values['noComma']}
          onChange={handleChange('noComma')}
        />
        <ValueDisplay value={values['noComma'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>パーセント入力</label>
        <InputNumber
          style={{ width: '100%' }}
          precision={1}
          value={values['percent']}
          onChange={handleChange('percent')}
          formatter={(value) => `${value}%`}
          parser={(value) => Number(value!.replace('%', ''))}
        />
        <ValueDisplay value={values['percent'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>通貨入力（円）</label>
        <InputNumber
          style={{ width: '100%' }}
          value={values['currency']}
          onChange={handleChange('currency')}
          formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => Number(value!.replace(/¥\s?|,/g, ''))}
        />
        <ValueDisplay value={values['currency'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>範囲制限（0〜100）</label>
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          max={100}
          value={values['range']}
          onChange={handleChange('range')}
        />
        <ValueDisplay value={values['range'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>マイナス値許可</label>
        <InputNumber
          style={{ width: '100%' }}
          value={values['negative']}
          onChange={handleChange('negative')}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => Number(value!.replace(/,/g, ''))}
        />
        <ValueDisplay value={values['negative'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>ステッパー付き（step: 10）</label>
        <InputNumber
          style={{ width: '100%' }}
          step={10}
          min={0}
          max={1000}
          value={values['stepper']}
          onChange={handleChange('stepper')}
        />
        <ValueDisplay value={values['stepper'] ?? null} />
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
