import { useState } from 'react'
import { AntdProductCodeInput } from './AntdProductCodeInput'
import { ValueDisplay } from '../ValueDisplay'

export function AntdProductCodeDemo() {
  const [code, setCode] = useState<number | null>(null)
  const [name, setName] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <AntdProductCodeInput
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
