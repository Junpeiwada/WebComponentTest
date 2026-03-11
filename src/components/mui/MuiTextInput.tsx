import { useState } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { ValueDisplay } from '../ValueDisplay'

export function MuiTextInput() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={labelStyle}>基本テキスト</label>
        <TextField
          size="small"
          fullWidth
          placeholder="テキストを入力"
          label="名前"
          value={values['basic'] ?? ''}
          onChange={handleChange('basic')}
        />
        <ValueDisplay value={values['basic'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>文字数制限付き（20文字）</label>
        <TextField
          size="small"
          fullWidth
          value={values['limited'] ?? ''}
          onChange={handleChange('limited')}
          slotProps={{ input: { inputProps: { maxLength: 20 } } }}
          helperText={`${(values['limited'] ?? '').length}/20`}
        />
        <ValueDisplay value={values['limited'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>パスワード入力</label>
        <TextField
          size="small"
          fullWidth
          type={showPassword ? 'text' : 'password'}
          value={values['password'] ?? ''}
          onChange={handleChange('password')}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁'}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <ValueDisplay value={values['password'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>複数行（TextArea）</label>
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={values['textarea'] ?? ''}
          onChange={handleChange('textarea')}
          placeholder="複数行テキスト"
        />
        <ValueDisplay value={values['textarea'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>prefix / suffix 付き</label>
        <TextField
          size="small"
          fullWidth
          value={values['affix'] ?? ''}
          onChange={handleChange('affix')}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">https://</InputAdornment>,
              endAdornment: <InputAdornment position="end">.com</InputAdornment>,
            },
          }}
        />
        <ValueDisplay value={values['affix'] ?? null} />
      </div>

      <div>
        <label style={labelStyle}>disabled</label>
        <TextField size="small" fullWidth disabled value="変更できません" />
        <ValueDisplay value="変更できません" />
      </div>

      <div>
        <label style={labelStyle}>readonly</label>
        <TextField
          size="small"
          fullWidth
          value="読み取り専用"
          slotProps={{ input: { readOnly: true } }}
        />
        <ValueDisplay value="読み取り専用" />
      </div>

      <div>
        <label style={labelStyle}>エラー表示（5文字以上でエラー）</label>
        <TextField
          size="small"
          fullWidth
          error={error}
          helperText={error ? '5文字以内で入力してください' : ''}
          value={values['error'] ?? ''}
          onChange={(e) => {
            handleChange('error')(e)
            setError(e.target.value.length > 5)
          }}
        />
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
