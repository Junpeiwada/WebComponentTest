import { useState } from 'react'
import { MuiProductCodeInput } from './MuiProductCodeInput'
import { ValueDisplay } from '../ValueDisplay'

export function MuiProductCodeDemo() {
  const [code, setCode] = useState<number | null>(null)
  const [name, setName] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4, color: '#333' }}>&#x2699; 商品コード入力<span style={{ color: 'darkgreen' }}>【独自実装】</span></label>
        <MuiProductCodeInput
          value={code}
          onChange={(c, n) => {
            setCode(c)
            setName(n)
          }}
        />
        <ValueDisplay value={code != null ? { code, name } : null} />
      </div>
    </div>
  )
}
