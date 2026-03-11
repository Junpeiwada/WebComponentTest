import { useState } from 'react'
import { MuiProductCodeInput } from './MuiProductCodeInput'
import { ValueDisplay } from '../ValueDisplay'

export function MuiProductCodeDemo() {
  const [code, setCode] = useState<number | null>(null)
  const [name, setName] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
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
