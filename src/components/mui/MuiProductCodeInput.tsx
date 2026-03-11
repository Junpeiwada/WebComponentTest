import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
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
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

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
    const row = rowRefs.current.get(highlightIndex)
    if (row) {
      row.scrollIntoView({ block: 'nearest' })
    }
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        onEntered: () => searchInputRef.current?.focus(),
      }}
    >
      <DialogTitle>商品検索</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={searchInputRef}
          size="small"
          fullWidth
          placeholder="コードまたは商品名で絞り込み（↑↓で選択、Enterで確定）"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          autoFocus
          sx={{ mb: 2, mt: 1 }}
        />
        <Box ref={scrollContainerRef} sx={{ height: 400, overflow: 'auto' }}>
          {filtered.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', pt: 8 }}>
              該当する商品がありません
            </Typography>
          ) : (
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: 100 }}>商品コード</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>商品名</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((p, i) => (
                  <TableRow
                    key={p.code}
                    ref={(el) => {
                      if (el) rowRefs.current.set(i, el)
                      else rowRefs.current.delete(i)
                    }}
                    hover
                    selected={i === highlightIndex}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      onSelect(p)
                      setSearch('')
                      setHighlightIndex(0)
                    }}
                    onMouseEnter={() => setHighlightIndex(i)}
                  >
                    <TableCell>{p.code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export function MuiProductCodeInput({ value, onChange }: ProductCodeInputProps) {
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
    if (e.key === 'Enter') {
      lookup(inputValue)
    }
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

  return (
    <>
      <div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            size="small"
            placeholder="商品コード"
            value={inputValue}
            error={error}
            onChange={(e) => {
              const v = e.target.value
              if (composingRef.current) {
                setInputValue(v)
                return
              }
              if (v === '' || /^\d+$/.test(v)) {
                setInputValue(v)
                if (error) setError(false)
              }
            }}
            onCompositionStart={() => { composingRef.current = true }}
            onCompositionEnd={(e) => {
              composingRef.current = false
              const v = (e.target as HTMLInputElement).value.replace(/\D/g, '')
              setInputValue(v)
              if (error && v !== '') setError(false)
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            sx={{ width: 140 }}
            slotProps={{
              htmlInput: {
                inputMode: 'numeric',
                pattern: '[0-9]*',
              },
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => setDialogOpen(true)}
            sx={{ minWidth: 0, width: 32, height: 32, p: 0 }}
          >
            <SearchIcon fontSize="small" />
          </Button>
          <Typography variant="body2">
            {productName}
          </Typography>
        </Box>
        {error ? (
          <Typography variant="caption" color="error" sx={{ ml: 1.5 }}>
            存在しない商品コードです
          </Typography>
        ) : (
          <Typography variant="caption" color="text.disabled" sx={{ ml: 1.5 }}>
            F2: 検索ダイアログ
          </Typography>
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
