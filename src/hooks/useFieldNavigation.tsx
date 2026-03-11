import { createContext, useContext, useEffect, useRef, useCallback, type ReactNode } from 'react'

export interface FieldHandle {
  focus(): void
}

interface FieldNavigationContextValue {
  register: (name: string, handle: FieldHandle) => void
  unregister: (name: string) => void
  moveNext: (name: string) => void
}

const FieldNavigationContext = createContext<FieldNavigationContextValue | null>(null)

interface FieldProviderProps {
  order: string[]
  children: ReactNode
}

export function FieldProvider({ order, children }: FieldProviderProps) {
  const handles = useRef<Map<string, FieldHandle>>(new Map())

  const register = useCallback((name: string, handle: FieldHandle) => {
    handles.current.set(name, handle)
  }, [])

  const unregister = useCallback((name: string) => {
    handles.current.delete(name)
  }, [])

  const moveNext = useCallback(
    (name: string) => {
      const idx = order.indexOf(name)
      if (idx === -1) return
      for (let i = idx + 1; i < order.length; i++) {
        const next = handles.current.get(order[i])
        if (next) {
          next.focus()
          return
        }
      }
      // 最後のフィールドなら先頭に戻る
      for (let i = 0; i < idx; i++) {
        const next = handles.current.get(order[i])
        if (next) {
          next.focus()
          return
        }
      }
    },
    [order]
  )

  return (
    <FieldNavigationContext.Provider value={{ register, unregister, moveNext }}>
      {children}
    </FieldNavigationContext.Provider>
  )
}

/**
 * 各フィールドが呼ぶhook。
 * refCallback を input 要素の ref に渡し、onKeyDown をキーハンドラに追加する。
 */
export function useFieldRegistration(name: string) {
  const ctx = useContext(FieldNavigationContext)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!ctx) return
    ctx.register(name, {
      focus: () => {
        inputRef.current?.focus()
        inputRef.current?.select()
      },
    })
    return () => ctx.unregister(name)
  }, [name, ctx])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!ctx) return
      if (e.nativeEvent.isComposing) return
      if (e.key === 'Enter') {
        e.preventDefault()
        ctx.moveNext(name)
      }
    },
    [name, ctx]
  )

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }, [])

  return { inputRef, handleKeyDown, handleFocus }
}
