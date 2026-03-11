interface ValueDisplayProps {
  value: unknown
}

export function ValueDisplay({ value }: ValueDisplayProps) {
  const formatted = value === null || value === undefined || value === ''
    ? '(未入力)'
    : JSON.stringify(value)

  return (
    <div
      style={{
        marginTop: 4,
        padding: '2px 8px',
        fontSize: 12,
        color: '#1976d2',
        backgroundColor: '#e3f2fd',
        borderRadius: 4,
        fontFamily: 'monospace',
      }}
    >
      送信値: {formatted}
    </div>
  )
}
