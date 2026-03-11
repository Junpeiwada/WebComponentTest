import { useState } from 'react'
import { Table, Tag, Input } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { tableData, type TableRow } from '../../data/tableData'

const columns: ColumnsType<TableRow> = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 70,
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: '名前',
    dataIndex: 'name',
    width: 120,
    sorter: (a, b) => a.name.localeCompare(b.name, 'ja'),
  },
  {
    title: '年齢',
    dataIndex: 'age',
    width: 80,
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '部署',
    dataIndex: 'department',
    width: 120,
    filters: [
      { text: '開発', value: '開発' },
      { text: '営業', value: '営業' },
      { text: '人事', value: '人事' },
      { text: '経理', value: '経理' },
      { text: 'マーケティング', value: 'マーケティング' },
    ],
    onFilter: (value, record) => record.department === value,
  },
  {
    title: 'ステータス',
    dataIndex: 'status',
    width: 110,
    filters: [
      { text: '在籍', value: '在籍' },
      { text: '休職', value: '休職' },
      { text: '退職', value: '退職' },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status: string) => {
      const color = status === '在籍' ? 'green' : status === '休職' ? 'gold' : 'red'
      return <Tag color={color}>{status}</Tag>
    },
  },
  {
    title: '給与',
    dataIndex: 'salary',
    width: 120,
    sorter: (a, b) => a.salary - b.salary,
    render: (val: number) => `¥${val.toLocaleString()}`,
    align: 'right',
  },
  {
    title: '入社日',
    dataIndex: 'joinDate',
    width: 120,
    sorter: (a, b) => a.joinDate.localeCompare(b.joinDate),
  },
  {
    title: 'メール',
    dataIndex: 'email',
    width: 200,
    ellipsis: true,
  },
]

export function AntdTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [searchText, setSearchText] = useState('')

  const filteredData = searchText
    ? tableData.filter(
        (row) =>
          row.name.includes(searchText) ||
          row.department.includes(searchText) ||
          row.email.includes(searchText)
      )
    : tableData

  const rowSelection: TableProps<TableRow>['rowSelection'] = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 基本テーブル（ソート・フィルター・ページネーション） */}
      <div>
        <label style={labelStyle}>基本テーブル（ソート・フィルター・ページネーション）</label>
        <Table<TableRow>
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: [5, 10, 25] }}
          scroll={{ x: 800 }}
        />
      </div>

      {/* 行選択 + 検索 */}
      <div>
        <label style={labelStyle}>行選択 + テキスト検索</label>
        <Input.Search
          placeholder="名前・部署・メールで検索"
          allowClear
          style={{ width: 300, marginBottom: 8 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Table<TableRow>
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          size="small"
          rowSelection={rowSelection}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 800 }}
        />
        <p style={{ fontSize: 12, color: '#666', margin: '4px 0 0' }}>
          選択中: {selectedRowKeys.length}件
        </p>
      </div>

      <div>
        <label style={labelStyle}>備考</label>
        <ul style={{ fontSize: 12, color: '#666', margin: 0, paddingLeft: 20 }}>
          <li>ソート・フィルタ・ページネーション・行選択は全て無料版で利用可能</li>
          <li>仮想スクロール（virtual）で大量データも高速表示可能</li>
          <li>展開行（expandable）、ツリーデータ、固定列/ヘッダーも標準搭載</li>
          <li>セル編集は自前実装が必要（EditableCell パターン）</li>
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
