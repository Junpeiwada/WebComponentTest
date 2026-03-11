interface SectionHeaderProps {
  title: string
  description?: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 20, borderBottom: '2px solid #1976d2', paddingBottom: 8 }}>
        {title}
      </h2>
      {description && (
        <p style={{ margin: '8px 0 0', color: '#666', fontSize: 14 }}>{description}</p>
      )}
    </div>
  )
}
