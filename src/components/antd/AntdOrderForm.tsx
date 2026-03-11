import { useState, useRef, useCallback, useEffect } from 'react'
import { Input, Divider, Typography } from 'antd'
import type { InputRef } from 'antd'
import { NumericFormat } from 'react-number-format'
import { FieldProvider, useFieldRegistration } from '../../hooks/useFieldNavigation'
import { AntdProductCodeInput } from './AntdProductCodeInput'
import { AntdCodeInput } from './AntdCodeInput'
import { FlexDateInputAntd } from '../common/FlexDateInputAntd'
import type { SelectOption, Product } from '../../types'
import products from '../../data/products.json'
import {
  suppliers, warehouses, staffMembers, paymentTerms,
  deliveryMethods, priorities, currencies, orderTypes,
  departments, fieldOrder,
} from '../../data/orderFormData'

const { Text } = Typography
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 2, color: '#888' } as const

// --- フィールドラッパーコンポーネント ---

function FieldText({
  name, label, placeholder, style,
}: {
  name: string; label: string; placeholder?: string; style?: React.CSSProperties
}) {
  const { inputRef, handleKeyDown, handleFocus } = useFieldRegistration(name)
  const antdRef = useRef<InputRef>(null)

  return (
    <div style={style}>
      <label style={labelStyle}>{label}</label>
      <Input
        ref={antdRef}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      />
      <input
        ref={inputRef}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        onFocus={() => antdRef.current?.focus()}
      />
    </div>
  )
}

function FieldNumeric({
  name, label, placeholder, value, onValueChange, style,
}: {
  name: string; label: string; placeholder?: string
  value: number | undefined; onValueChange: (v: number | undefined) => void
  style?: React.CSSProperties
}) {
  const { inputRef, handleKeyDown, handleFocus } = useFieldRegistration(name)
  const wrapperRef = useRef<HTMLDivElement>(null)
  return (
    <div style={style} ref={wrapperRef}>
      <label style={labelStyle}>{label}</label>
      <NumericFormat
        customInput={Input}
        thousandSeparator=","
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        value={value ?? ''}
        onValueChange={(v) => onValueChange(v.floatValue)}
        style={{ textAlign: 'right' }}
      />
      <input
        ref={inputRef}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        onFocus={() => {
          const realInput = wrapperRef.current?.querySelector('input:not([aria-hidden])') as HTMLInputElement | null
          realInput?.focus()
        }}
      />
    </div>
  )
}

function FieldCodeInput<T extends number | string>({
  name, label, options, placeholder, style,
}: {
  name: string; label: string; options: SelectOption<T>[]; placeholder?: string
  style?: React.CSSProperties
}) {
  const { inputRef, handleKeyDown } = useFieldRegistration(name)
  const [, setVal] = useState<T | null>(null)
  const dropdownOpenRef = useRef(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <div style={style} ref={wrapperRef}>
      <label style={labelStyle}>{label}</label>
      <div
        onKeyDownCapture={(e) => {
          if (e.nativeEvent.isComposing) return
          if (e.key === 'Enter' && !dropdownOpenRef.current) {
            e.stopPropagation()
            handleKeyDown(e)
          }
        }}
      >
        <AntdCodeInput
          options={options}
          placeholder={placeholder}
          onChange={setVal}
          onDropdownOpenChange={(open) => { dropdownOpenRef.current = open }}
        />
      </div>
      <input
        ref={inputRef}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        onFocus={() => {
          const realInput = wrapperRef.current?.querySelector('input:not([aria-hidden])') as HTMLInputElement | null
          realInput?.focus()
        }}
      />
    </div>
  )
}

function FieldDate({ name, label, style }: { name: string; label: string; style?: React.CSSProperties }) {
  const { inputRef, handleKeyDown } = useFieldRegistration(name)
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <div style={style} ref={wrapperRef}>
      <label style={labelStyle}>{label}</label>
      <div
        onKeyDownCapture={(e) => {
          if (e.nativeEvent.isComposing) return
          if (e.key === 'Enter') {
            handleKeyDown(e)
          }
        }}
      >
        <FlexDateInputAntd placeholder="日付を入力" />
      </div>
      <input
        ref={inputRef}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        onFocus={() => {
          const realInput = wrapperRef.current?.querySelector('input:not([aria-hidden])') as HTMLInputElement | null
          realInput?.focus()
        }}
      />
    </div>
  )
}

function FieldProductCode({
  name, label, onProductChange, style,
}: {
  name: string; label: string
  onProductChange?: (code: number | null, product: Product | null) => void
  style?: React.CSSProperties
}) {
  const { inputRef, handleKeyDown } = useFieldRegistration(name)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleProductKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.nativeEvent.isComposing) return
      if (e.key === 'Enter') {
        e.preventDefault()
        handleKeyDown(e)
      }
    },
    [handleKeyDown]
  )

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
    <div style={style} ref={wrapperRef}>
      <label style={labelStyle}>{label}</label>
      <div onKeyDownCapture={handleProductKeyDown}>
        <AntdProductCodeInput value={null} onChange={handleChange} />
      </div>
      <input
        ref={inputRef}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        onFocus={() => {
          const realInput = wrapperRef.current?.querySelector('input:not([aria-hidden])') as HTMLInputElement | null
          realInput?.focus()
        }}
      />
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <FieldProductCode
        name={`productCode${prefix}`}
        label="商品コード"
        onProductChange={handleProductChange}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 90px 130px 1fr',
        gap: 8,
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
      </div>
    </div>
  )
}

// --- セクション ---

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f0f0f0',
      borderRadius: 8,
      padding: '12px 16px 16px',
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: '#333',
        marginBottom: 12,
        paddingBottom: 6,
        borderBottom: '2px solid #1677ff',
        display: 'inline-block',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

// --- メインフォーム ---

export function AntdOrderForm() {
  return (
    <FieldProvider order={fieldOrder}>
      <div style={{ maxWidth: 900 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
          Enterキーで次のフィールドへ移動します。最後のフィールドから先頭に戻ります。
        </Text>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
          {/* 基本情報 */}
          <Section title="基本情報">
            <div style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr 1fr',
              gap: '10px 12px',
            }}>
              <FieldDate name="orderDate" label="発注日" />
              <FieldCodeInput name="supplier" label="仕入先" options={suppliers} placeholder="コードを入力" />
              <FieldCodeInput name="staff" label="担当者" options={staffMembers} placeholder="コードを入力" />
              <FieldCodeInput
                name="warehouse"
                label="納品先倉庫"
                options={warehouses}
                placeholder="コードを入力"
                style={{ gridColumn: 'span 1' }}
              />
              <FieldCodeInput name="orderType" label="発注区分" options={orderTypes} placeholder="コードを入力" />
              <FieldCodeInput name="department" label="部署" options={departments} placeholder="コードを入力" />
            </div>
          </Section>

          {/* 明細 */}
          <Section title="明細">
            <DetailRow prefix="1" />
          </Section>

          {/* 配送・支払 */}
          <Section title="配送・支払">
            <div style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr 1fr 120px',
              gap: '10px 12px',
            }}>
              <FieldDate name="deliveryDate" label="納品希望日" />
              <FieldCodeInput name="paymentTerm" label="支払条件" options={paymentTerms} placeholder="コードを入力" />
              <FieldCodeInput name="deliveryMethod" label="配送方法" options={deliveryMethods} placeholder="コードを入力" />
              <FieldCodeInput name="priority" label="優先度" options={priorities} placeholder="コードを入力" />
              <FieldCodeInput
                name="currency"
                label="通貨"
                options={currencies}
                placeholder="コードを入力"
                style={{ gridColumn: 'span 1' }}
              />
              <FieldCodeInput name="approver" label="承認者" options={staffMembers} placeholder="コードを入力" />
              <FieldText
                name="generalRemark"
                label="全体備考"
                placeholder="全体の備考を入力"
                style={{ gridColumn: 'span 2' }}
              />
            </div>
          </Section>
        </div>
      </div>
    </FieldProvider>
  )
}
