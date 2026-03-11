import { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import { yesNoOptions, prefectures } from '../../data/sampleData'
import { ValueDisplay } from '../ValueDisplay'
import { MuiCodeInput } from './MuiCodeInput'

export function MuiAutocomplete() {
  const [vals, setVals] = useState<Record<string, unknown>>({})
  const [asyncLoading, setAsyncLoading] = useState(false)
  const [asyncOptions, setAsyncOptions] = useState<typeof prefectures>([])
  const [asyncOpen, setAsyncOpen] = useState(false)

  const simulateAsync = () => {
    if (asyncOptions.length > 0) return
    setAsyncLoading(true)
    setTimeout(() => {
      setAsyncOptions(prefectures)
      setAsyncLoading(false)
    }, 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={labelStyle}>コード入力（1→1:いいえ, 2→2:はい, 22→22:不明, 44→44:該当なし）</label>
        <MuiCodeInput
          options={yesNoOptions}
          placeholder="1 or 2 を入力"
          onChange={(val) => setVals((prev) => ({ ...prev, code: val }))}
        />
        <ValueDisplay value={vals['code'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>基本（label/value マッピング） - はい/いいえ</label>
        <Autocomplete
          size="small"
          options={yesNoOptions}
          getOptionLabel={(opt) => opt.label}
          onChange={(_e, val) => setVals((prev) => ({ ...prev, basic: val?.value ?? null }))}
          renderInput={(params) => <TextField {...params} placeholder="選択してください" />}
        />
        <ValueDisplay value={vals['basic'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>自由入力許可 (freeSolo)</label>
        <Autocomplete
          size="small"
          freeSolo
          options={prefectures.map((p) => p.label)}
          onChange={(_e, val) => {
            const found = prefectures.find((p) => p.label === val)
            setVals((prev) => ({ ...prev, free: found?.value ?? val ?? null }))
          }}
          renderInput={(params) => <TextField {...params} placeholder="都道府県を入力" />}
        />
        <ValueDisplay value={vals['free'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>自由入力不許可（候補からのみ）</label>
        <Autocomplete
          size="small"
          options={prefectures}
          getOptionLabel={(opt) => opt.label}
          onChange={(_e, val) => setVals((prev) => ({ ...prev, strict: val?.value ?? null }))}
          renderInput={(params) => <TextField {...params} placeholder="都道府県を選択" />}
        />
        <ValueDisplay value={vals['strict'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>複数選択</label>
        <Autocomplete
          size="small"
          multiple
          options={yesNoOptions}
          getOptionLabel={(opt) => opt.label}
          onChange={(_e, selected) => {
            setVals((prev) => ({ ...prev, multi: selected.map((v) => v.value) }))
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option.label} size="small" {...getTagProps({ index })} key={option.value} />
            ))
          }
          renderInput={(params) => <TextField {...params} placeholder="複数選択" />}
        />
        <ValueDisplay value={vals['multi'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>グループ化（地方別）</label>
        <Autocomplete
          size="small"
          options={prefectures.sort((a, b) => a.region.localeCompare(b.region))}
          groupBy={(opt) => opt.region}
          getOptionLabel={(opt) => opt.label}
          onChange={(_e, val) => setVals((prev) => ({ ...prev, group: val?.value ?? null }))}
          renderInput={(params) => <TextField {...params} placeholder="都道府県を選択" />}
        />
        <ValueDisplay value={vals['group'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>非同期データ読み込み</label>
        <Autocomplete
          size="small"
          open={asyncOpen}
          onOpen={() => {
            setAsyncOpen(true)
            simulateAsync()
          }}
          onClose={() => setAsyncOpen(false)}
          options={asyncOptions}
          loading={asyncLoading}
          getOptionLabel={(opt) => opt.label}
          onChange={(_e, val) => setVals((prev) => ({ ...prev, async: val?.value ?? null }))}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="クリックで読み込み"
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {asyncLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
        />
        <ValueDisplay value={vals['async'] ?? null} />
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
