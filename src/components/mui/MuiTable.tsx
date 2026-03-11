import { useState } from 'react'
import { DataGrid, type GridColDef, type GridRowSelectionModel } from '@mui/x-data-grid'
import { tableData, type TableRow } from '../../data/tableData'

const columns: GridColDef<TableRow>[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: '名前', width: 120 },
  { field: 'age', headerName: '年齢', width: 80, type: 'number' },
  { field: 'department', headerName: '部署', width: 120 },
  {
    field: 'status',
    headerName: 'ステータス',
    width: 110,
    renderCell: (params) => {
      const color = params.value === '在籍' ? '#52c41a' : params.value === '休職' ? '#faad14' : '#ff4d4f'
      return (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: `${color}20`,
            color,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {params.value}
        </span>
      )
    },
  },
  {
    field: 'salary',
    headerName: '給与',
    width: 120,
    type: 'number',
    valueFormatter: (value: number) => `¥${value.toLocaleString()}`,
  },
  { field: 'joinDate', headerName: '入社日', width: 120 },
  { field: 'email', headerName: 'メール', width: 200 },
]

export function MuiTable() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 基本テーブル（ソート・ページネーション付き） */}
      <div>
        <label style={labelStyle}>基本テーブル（ソート・ページネーション）</label>
        <div style={{ height: 370 }}>
          <DataGrid
            rows={tableData}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            density="compact"
          />
        </div>
      </div>

      {/* 行選択 */}
      <div>
        <label style={labelStyle}>行選択（チェックボックス）</label>
        <div style={{ height: 370 }}>
          <DataGrid
            rows={tableData}
            columns={columns}
            checkboxSelection
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(model) => setSelectionModel(model)}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10]}
            density="compact"
          />
        </div>
        <p style={{ fontSize: 12, color: '#666', margin: '4px 0 0' }}>
          選択中: {selectionModel.type === 'include' ? selectionModel.ids.size : '-'}件
        </p>
      </div>

      <div>
        <label style={labelStyle}>備考</label>
        <ul style={{ fontSize: 12, color: '#666', margin: 0, paddingLeft: 20 }}>
          <li>このデモは全て無料版（Community）の機能のみで構成しています</li>
          <li>列のリサイズ・列の順序入替・列グループ・ツリーデータ・集計行は<span style={{ color: '#d32f2f', fontWeight: 700 }}>有料版（Pro/Premium）が必要</span></li>
        </ul>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  marginBottom: 4,
  color: '#333',
}
