import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Input, Button, Modal, Table } from 'antd'
import type { InputRef } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { Product } from '../../types'
import products from '../../data/products.json'

interface ProductCodeInputProps {
  value: number | null
  onChange: (code: number | null, name: string) => void
}

function ProductSearchDialog({
  open,
  onClose,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  onSelect: (product: Product) => void
}) {
  const [search, setSearch] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(0)
  const tableRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<InputRef>(null)

  const filtered = useMemo(
    () =>
      search
        ? (products as Product[]).filter(
            (p) => p.name.includes(search) || String(p.code).includes(search)
          )
        : (products as Product[]),
    [search]
  )

  useEffect(() => {
    setHighlightIndex(0)
  }, [search])

  useEffect(() => {
    if (!tableRef.current) return
    const rows = tableRef.current.querySelectorAll('tbody tr')
    rows[highlightIndex]?.scrollIntoView({ block: 'nearest' })
  }, [highlightIndex])

  const handleClose = useCallback(() => {
    setSearch('')
    setHighlightIndex(0)
    onClose()
  }, [onClose])

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return
    if (filtered.length === 0) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        onSelect(filtered[highlightIndex])
        setSearch('')
        setHighlightIndex(0)
        break
    }
  }

  const columns = [
    { title: '商品コード', dataIndex: 'code', key: 'code', width: 100 },
    { title: '商品名', dataIndex: 'name', key: 'name' },
  ]

  return (
    <Modal
      title="商品検索"
      open={open}
      onCancel={handleClose}
      afterOpenChange={(visible) => {
        if (visible) searchInputRef.current?.focus()
      }}
      footer={null}
      width={500}
    >
      <Input
        ref={searchInputRef}
        placeholder="コードまたは商品名で絞り込み（↑↓で選択、Enterで確定）"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearchKeyDown}
        autoFocus
        style={{ marginBottom: 16 }}
      />
      <div ref={tableRef} style={{ height: 400 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80, color: '#999' }}>
            該当する商品がありません
          </div>
        ) : (
          <>
            <Table
              dataSource={filtered}
              columns={columns}
              rowKey="code"
              size="small"
              pagination={false}
              scroll={{ y: 360 }}
              rowClassName={(_record, index) =>
                index === highlightIndex ? 'ant-table-row-highlight' : ''
              }
              onRow={(record, index) => ({
                onClick: () => {
                  onSelect(record as Product)
                  setSearch('')
                  setHighlightIndex(0)
                },
                onMouseEnter: () => setHighlightIndex(index ?? 0),
                style: { cursor: 'pointer' },
              })}
            />
            <style>{`.ant-table-row-highlight > td { background-color: #e6f4ff !important; }`}</style>
          </>
        )}
      </div>
    </Modal>
  )
}

export function AntdProductCodeInput({ value, onChange }: ProductCodeInputProps) {
  const [inputValue, setInputValue] = useState(value?.toString() ?? '')
  const [productName, setProductName] = useState(() => {
    if (value == null) return ''
    return (products as Product[]).find((p) => p.code === value)?.name ?? ''
  })
  const [error, setError] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const composingRef = useRef(false)

  const lookup = (codeStr: string) => {
    if (codeStr === '') {
      setError(false)
      setProductName('')
      onChange(null, '')
      return
    }
    const code = Number(codeStr)
    const found = (products as Product[]).find((p) => p.code === code)
    if (found) {
      setError(false)
      setProductName(found.name)
      onChange(found.code, found.name)
    } else {
      setError(true)
      setProductName('')
      onChange(null, '')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'F2') {
      e.preventDefault()
      setDialogOpen(true)
    }
  }

  const handleBlur = () => {
    lookup(inputValue)
  }

  const handleSelect = (product: Product) => {
    setInputValue(String(product.code))
    setProductName(product.name)
    setError(false)
    onChange(product.code, product.name)
    setDialogOpen(false)
  }

  // 全角数字→半角数字変換
  const toHalfWidth = (s: string) => s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))

  return (
    <>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <Input
            size="middle"
            placeholder="商品コード"
            value={inputValue}
            status={error ? 'error' : undefined}
            onChange={(e) => {
              const v = e.target.value
              if (composingRef.current) {
                setInputValue(v)
                return
              }
              const half = toHalfWidth(v)
              if (half === '' || /^\d+$/.test(half)) {
                setInputValue(half)
                if (error) setError(false)
              }
            }}
            onCompositionStart={() => { composingRef.current = true }}
            onCompositionEnd={(e) => {
              composingRef.current = false
              const half = toHalfWidth((e.target as HTMLInputElement).value)
              const v = half.replace(/\D/g, '')
              setInputValue(v)
              if (error && v !== '') setError(false)
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={(e) => e.target.select()}
            style={{ width: 140, textAlign: 'right' }}
          />
          <Button
            icon={<SearchOutlined />}
            onClick={() => setDialogOpen(true)}
          />
          <span style={{ fontSize: 14 }}>
            {productName}
          </span>
        </div>
        {error ? (
          <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4, marginLeft: 2 }}>
            存在しない商品コードです
          </div>
        ) : (
          <div style={{ color: '#bbb', fontSize: 12, marginTop: 4, marginLeft: 2 }}>
            F2: 検索ダイアログ
          </div>
        )}
      </div>
      <ProductSearchDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelect={handleSelect}
      />
    </>
  )
}
