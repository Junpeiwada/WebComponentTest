import { useState } from 'react'
import { Input } from 'antd'
import { ValueDisplay } from '../ValueDisplay'

const { TextArea, Password } = Input

export function AntdTextInput() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [error, setError] = useState(false)

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={labelStyle}>基本テキスト</label>
        <Input
          placeholder="テキストを入力"
          value={values['basic'] ?? ''}
          onChange={handleChange('basic')}
        />
        <ValueDisplay value={values['basic'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>文字数制限付き（20文字）</label>
        <Input
          maxLength={20}
          showCount
          value={values['limited'] ?? ''}
          onChange={handleChange('limited')}
        />
        <ValueDisplay value={values['limited'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>パスワード入力</label>
        <Password
          value={values['password'] ?? ''}
          onChange={handleChange('password')}
        />
        <ValueDisplay value={values['password'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>複数行（TextArea）</label>
        <TextArea
          rows={3}
          placeholder="複数行テキスト"
          value={values['textarea'] ?? ''}
          onChange={handleChange('textarea')}
        />
        <ValueDisplay value={values['textarea'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>prefix / suffix 付き</label>
        <Input
          prefix="https://"
          suffix=".com"
          value={values['affix'] ?? ''}
          onChange={handleChange('affix')}
        />
        <ValueDisplay value={values['affix'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>disabled</label>
        <Input disabled value="変更できません" />
        <ValueDisplay value="変更できません" />
      </div>

      <div>
        <label style={labelStyle}>readonly</label>
        <Input readOnly value="読み取り専用" />
        <ValueDisplay value="読み取り専用" />
      </div>

      <div>
        <label style={labelStyle}>エラー表示（5文字以上でエラー）</label>
        <Input
          status={error ? 'error' : undefined}
          value={values['error'] ?? ''}
          onChange={(e) => {
            handleChange('error')(e)
            setError(e.target.value.length > 5)
          }}
        />
        {error && <p style={{ color: '#ff4d4f', fontSize: 12, margin: '4px 0 0' }}>5文字以内で入力してください</p>}
        <ValueDisplay value={values['error'] ?? null} />
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
