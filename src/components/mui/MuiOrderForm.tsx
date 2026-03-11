import { useState, useRef, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { NumericFormat } from 'react-number-format'
import { FieldProvider, useFieldRegistration } from '../../hooks/useFieldNavigation'
import { MuiProductCodeInput } from './MuiProductCodeInput'
import { MuiCodeInput } from './MuiCodeInput'
import { FlexDateInputMui } from '../common/FlexDateInputMui'
import type { SelectOption, Product } from '../../types'
import products from '../../data/products.json'
import {
  suppliers, warehouses, staffMembers, paymentTerms,
  deliveryMethods, priorities, currencies, orderTypes,
  departments, fieldOrder,
} from '../../data/orderFormData'

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 500, marginBottom: '2px', color: '#888' } as const

// --- フィールドラッパーコンポーネント ---

function FieldText({
  name, label, placeholder, sx,
}: {
  name: string; label: string; placeholder?: string; sx?: object
}) {
  const { inputRef } = useFieldRegistration(name)
  return (
    <Box sx={sx}>
      <label style={labelStyle}>{label}</label>
      <TextField
        size="small"
        fullWidth
        placeholder={placeholder}
        inputRef={inputRef}
        onFocus={(e) => e.target.select()}
      />
    </Box>
  )
}

function FieldNumeric({
  name, label, placeholder, value, onValueChange, sx,
}: {
  name: string; label: string; placeholder?: string
  value: number | undefined; onValueChange: (v: number | undefined) => void
  sx?: object
}) {
  const { inputRef } = useFieldRegistration(name)
  return (
    <Box sx={sx}>
      <label style={labelStyle}>{label}</label>
      <NumericFormat
        customInput={TextField}
        size="small"
        fullWidth
        thousandSeparator=","
        placeholder={placeholder}
        getInputRef={inputRef}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
        value={value ?? ''}
        onValueChange={(v) => onValueChange(v.floatValue)}
        slotProps={{ htmlInput: { style: { textAlign: 'right' } } }}
      />
    </Box>
  )
}

function FieldCodeInput<T extends number | string>({
  name, label, options, placeholder, sx,
}: {
  name: string; label: string; options: SelectOption<T>[]; placeholder?: string
  sx?: object
}) {
  const { inputRef } = useFieldRegistration(name)
  const [, setVal] = useState<T | null>(null)

  return (
    <Box sx={sx}>
      <label style={labelStyle}>{label}</label>
      <MuiCodeInput
        options={options}
        placeholder={placeholder}
        onChange={setVal}
      />
      <input
        ref={inputRef}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        onFocus={() => {
          const container = inputRef.current?.previousElementSibling
          const realInput = container?.querySelector('input') as HTMLInputElement | null
          realInput?.focus()
        }}
      />
    </Box>
  )
}

function FieldDate({ name, label, sx }: { name: string; label: string; sx?: object }) {
  const { inputRef } = useFieldRegistration(name)
  return (
    <Box sx={sx}>
      <label style={labelStyle}>{label}</label>
      <FlexDateInputMui placeholder="日付を入力" />
      <input
        ref={inputRef}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        onFocus={() => {
          const container = inputRef.current?.previousElementSibling
          const realInput = container?.querySelector('input') as HTMLInputElement | null
          realInput?.focus()
        }}
      />
    </Box>
  )
}

function FieldProductCode({
  name, label, onProductChange, sx,
}: {
  name: string; label: string
  onProductChange?: (code: number | null, product: Product | null) => void
  sx?: object
}) {
  const { inputRef } = useFieldRegistration(name)

  const handleChange = useCallback(
    (code: number | null, _name: string) => {
      if (code == null) {
        onProductChange?.(null, null)
      } else {
        const found = (products as Product[]).find((p) => p.code === code) ?? null
        onProductChange?.(code, found)
      }
    },
    [onProductChange]
  )

  return (
    <Box sx={sx}>
      <label style={labelStyle}>{label}</label>
      <MuiProductCodeInput value={null} onChange={handleChange} />
      <input
        ref={inputRef}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        onFocus={() => {
          const container = inputRef.current?.previousElementSibling
          const realInput = container?.querySelector('input') as HTMLInputElement | null
          realInput?.focus()
        }}
      />
    </Box>
  )
}

// --- 明細行コンポーネント ---

function DetailRow({ prefix }: { prefix: string }) {
  const [unitPrice, setUnitPrice] = useState<number | undefined>()
  const [quantity, setQuantity] = useState<number | undefined>()
  const [amount, setAmount] = useState<number | undefined>()
  const [amountManual, setAmountManual] = useState(false)

  const handleProductChange = useCallback((_code: number | null, product: Product | null) => {
    if (product) {
      setUnitPrice(product.unitPrice)
    } else {
      setUnitPrice(undefined)
    }
    setAmountManual(false)
  }, [])

  useEffect(() => {
    if (amountManual) return
    if (unitPrice != null && quantity != null) {
      setAmount(unitPrice * quantity)
    } else {
      setAmount(undefined)
    }
  }, [unitPrice, quantity, amountManual])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <FieldProductCode
        name={`productCode${prefix}`}
        label="商品コード"
        onProductChange={handleProductChange}
      />
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '120px 90px 130px 1fr',
        gap: '8px',
        alignItems: 'end',
      }}>
        <FieldNumeric
          name={`unitPrice${prefix}`}
          label="単価"
          placeholder="単価"
          value={unitPrice}
          onValueChange={(v) => {
            setUnitPrice(v)
            setAmountManual(false)
          }}
        />
        <FieldNumeric
          name={`quantity${prefix}`}
          label="数量"
          placeholder="数量"
          value={quantity}
          onValueChange={(v) => {
            setQuantity(v)
            setAmountManual(false)
          }}
        />
        <FieldNumeric
          name={`amount${prefix}`}
          label="金額"
          placeholder="自動計算"
          value={amount}
          onValueChange={(v) => {
            setAmount(v)
            setAmountManual(true)
          }}
        />
        <FieldText name={`remark${prefix}`} label="備考" placeholder="備考" />
      </Box>
    </Box>
  )
}

// --- セクション ---

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{
      bgcolor: '#fff',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      px: 2,
      pt: 1.5,
      pb: 2,
    }}>
      <Typography sx={{
        fontSize: 13,
        fontWeight: 600,
        color: 'text.primary',
        mb: 1.5,
        pb: 0.75,
        borderBottom: 2,
        borderColor: 'primary.main',
        display: 'inline-block',
      }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

// --- メインフォーム ---

export function MuiOrderForm() {
  return (
    <FieldProvider order={fieldOrder}>
      <Box sx={{ maxWidth: 900 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: 12 }}>
          フォーカス制御デモ（Enterキー移動は現在無効）
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, position: 'relative' }}>
          {/* 基本情報 */}
          <Section title="基本情報">
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr 1fr',
              gap: '10px 12px',
            }}>
              <FieldDate name="orderDate" label="発注日" />
              <FieldCodeInput name="supplier" label="仕入先" options={suppliers} placeholder="コードを入力" />
              <FieldCodeInput name="staff" label="担当者" options={staffMembers} placeholder="コードを入力" />
              <FieldCodeInput name="warehouse" label="納品先倉庫" options={warehouses} placeholder="コードを入力" />
              <FieldCodeInput name="orderType" label="発注区分" options={orderTypes} placeholder="コードを入力" />
              <FieldCodeInput name="department" label="部署" options={departments} placeholder="コードを入力" />
            </Box>
          </Section>

          {/* 明細 */}
          <Section title="明細">
            <DetailRow prefix="1" />
          </Section>

          {/* 配送・支払 */}
          <Section title="配送・支払">
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr 1fr 120px',
              gap: '10px 12px',
            }}>
              <FieldDate name="deliveryDate" label="納品希望日" />
              <FieldCodeInput name="paymentTerm" label="支払条件" options={paymentTerms} placeholder="コードを入力" />
              <FieldCodeInput name="deliveryMethod" label="配送方法" options={deliveryMethods} placeholder="コードを入力" />
              <FieldCodeInput name="priority" label="優先度" options={priorities} placeholder="コードを入力" />
              <FieldCodeInput name="currency" label="通貨" options={currencies} placeholder="コードを入力" />
              <FieldCodeInput name="approver" label="承認者" options={staffMembers} placeholder="コードを入力" />
              <FieldText
                name="generalRemark"
                label="全体備考"
                placeholder="全体の備考を入力"
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </Section>
        </Box>
      </Box>
    </FieldProvider>
  )
}
