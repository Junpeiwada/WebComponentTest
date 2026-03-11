import { useState } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { NumericFormat } from 'react-number-format'
import { ValueDisplay } from '../ValueDisplay'

export function MuiNumberInput() {
  const [values, setValues] = useState<Record<string, number | undefined>>({})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={labelStyle}>カンマ区切り整数</label>
        <NumericFormat
          customInput={TextField}
          size="small"
          fullWidth
          thousandSeparator=","
          value={values['comma'] ?? ''}
          onValueChange={(v) => setValues((prev) => ({ ...prev, comma: v.floatValue }))}
        />
        <ValueDisplay value={values['comma'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>カンマ区切り + 小数点（2桁）</label>
        <NumericFormat
          customInput={TextField}
          size="small"
          fullWidth
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          value={values['decimal'] ?? ''}
          onValueChange={(v) => setValues((prev) => ({ ...prev, decimal: v.floatValue }))}
        />
        <ValueDisplay value={values['decimal'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>小数点のみ（カンマなし）</label>
        <NumericFormat
          customInput={TextField}
          size="small"
          fullWidth
          decimalScale={2}
          value={values['noComma'] ?? ''}
          onValueChange={(v) => setValues((prev) => ({ ...prev, noComma: v.floatValue }))}
        />
        <ValueDisplay value={values['noComma'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>パーセント入力</label>
        <NumericFormat
          customInput={TextField}
          size="small"
          fullWidth
          suffix="%"
          decimalScale={1}
          value={values['percent'] ?? ''}
          onValueChange={(v) => setValues((prev) => ({ ...prev, percent: v.floatValue }))}
        />
        <ValueDisplay value={values['percent'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>通貨入力（円）</label>
        <NumericFormat
          customInput={TextField}
          size="small"
          fullWidth
          thousandSeparator=","
          prefix="¥"
          value={values['currency'] ?? ''}
          onValueChange={(v) => setValues((prev) => ({ ...prev, currency: v.floatValue }))}
        />
        <ValueDisplay value={values['currency'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>範囲制限（0〜100）</label>
        <NumericFormat
          customInput={TextField}
          size="small"
          fullWidth
          isAllowed={(v) => {
            const val = v.floatValue
            return val === undefined || (val >= 0 && val <= 100)
          }}
          value={values['range'] ?? ''}
          onValueChange={(v) => setValues((prev) => ({ ...prev, range: v.floatValue }))}
        />
        <ValueDisplay value={values['range'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>マイナス値許可</label>
        <NumericFormat
          customInput={TextField}
          size="small"
          fullWidth
          thousandSeparator=","
          allowNegative
          value={values['negative'] ?? ''}
          onValueChange={(v) => setValues((prev) => ({ ...prev, negative: v.floatValue }))}
        />
        <ValueDisplay value={values['negative'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>ステッパー付き（MUI TextField + ボタン）</label>
        <TextField
          type="number"
          size="small"
          fullWidth
          value={values['stepper'] ?? ''}
          onChange={(e) => {
            const v = e.target.value === '' ? undefined : Number(e.target.value)
            setValues((prev) => ({ ...prev, stepper: v }))
          }}
          slotProps={{
            input: {
              inputProps: { step: 10, min: 0, max: 1000 },
              endAdornment: <InputAdornment position="end">step:10</InputAdornment>,
            },
          }}
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
