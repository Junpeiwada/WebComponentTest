import { useState } from 'react'
import { AutoComplete, Select, Spin, Tag } from 'antd'
import { yesNoOptions, prefectures } from '../../data/sampleData'
import { ValueDisplay } from '../ValueDisplay'
import { AntdCodeInput } from './AntdCodeInput'

export function AntdAutocomplete() {
  const [vals, setVals] = useState<Record<string, unknown>>({})
  const [asyncLoading, setAsyncLoading] = useState(false)
  const [asyncOptions, setAsyncOptions] = useState<typeof prefectures>([])

  const simulateAsync = () => {
    if (asyncOptions.length > 0) return
    setAsyncLoading(true)
    setTimeout(() => {
      setAsyncOptions(prefectures)
      setAsyncLoading(false)
    }, 1500)
  }

  const groupedOptions = (() => {
    const regions = [...new Set(prefectures.map((p) => p.region))]
    return regions.map((region) => ({
      label: region,
      options: prefectures
        .filter((p) => p.region === region)
        .map((p) => ({ label: p.label, value: p.value })),
    }))
  })()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={labelStyle}>コード入力（1→1:いいえ, 2→2:はい）</label>
        <AntdCodeInput
          options={yesNoOptions}
          placeholder="1 or 2 を入力"
          onChange={(val) => setVals((prev) => ({ ...prev, code: val }))}
        />
        <ValueDisplay value={vals['code'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>基本（label/value マッピング） - はい/いいえ</label>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="選択してください"
          options={yesNoOptions}
          optionFilterProp="label"
          onChange={(val) => setVals((prev) => ({ ...prev, basic: val ?? null }))}
        />
        <ValueDisplay value={vals['basic'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>自由入力許可 (freeSolo相当)</label>
        <AutoComplete
          style={{ width: '100%' }}
          placeholder="都道府県を入力"
          options={prefectures.map((p) => ({ label: p.label, value: p.label }))}
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          onChange={(val) => {
            const found = prefectures.find((p) => p.label === val)
            setVals((prev) => ({ ...prev, free: found?.value ?? val ?? null }))
          }}
        />
        <ValueDisplay value={vals['free'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>自由入力不許可（候補からのみ）</label>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="都道府県を選択"
          options={prefectures.map((p) => ({ label: p.label, value: p.value }))}
          optionFilterProp="label"
          onChange={(val) => setVals((prev) => ({ ...prev, strict: val ?? null }))}
        />
        <ValueDisplay value={vals['strict'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>複数選択</label>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="複数選択"
          options={yesNoOptions}
          optionFilterProp="label"
          onChange={(vals: number[]) => setVals((prev) => ({ ...prev, multi: vals }))}
          tagRender={({ label, closable, onClose }) => (
            <Tag closable={closable} onClose={onClose} style={{ marginInlineEnd: 4 }}>
              {label}
            </Tag>
          )}
        />
        <ValueDisplay value={vals['multi'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>グループ化（地方別）</label>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="都道府県を選択"
          options={groupedOptions}
          optionFilterProp="label"
          onChange={(val) => setVals((prev) => ({ ...prev, group: val ?? null }))}
        />
        <ValueDisplay value={vals['group'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>非同期データ読み込み</label>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="クリックで読み込み"
          options={asyncOptions.map((p) => ({ label: p.label, value: p.value }))}
          optionFilterProp="label"
          onDropdownVisibleChange={(open) => {
            if (open) simulateAsync()
          }}
          notFoundContent={asyncLoading ? <Spin size="small" /> : null}
          onChange={(val) => setVals((prev) => ({ ...prev, async: val ?? null }))}
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
