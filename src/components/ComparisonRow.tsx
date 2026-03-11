import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

interface ComparisonRowProps {
  muiContent: ReactNode
  antdContent: ReactNode
}

export function ComparisonRow({ muiContent, antdContent }: ComparisonRowProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 3,
      }}
    >
      <Paper variant="outlined" sx={{ p: 2.5, maxWidth: 480 }}>
        <Typography
          variant="overline"
          sx={{ color: '#1976d2', fontWeight: 700, letterSpacing: 1, mb: 1.5, display: 'block' }}
        >
          MUI (Material UI)
        </Typography>
        {muiContent}
      </Paper>
      <Paper variant="outlined" sx={{ p: 2.5, maxWidth: 480 }}>
        <Typography
          variant="overline"
          sx={{ color: '#1677ff', fontWeight: 700, letterSpacing: 1, mb: 1.5, display: 'block' }}
        >
          Ant Design
        </Typography>
        {antdContent}
      </Paper>
    </Box>
  )
}
