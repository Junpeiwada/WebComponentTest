import type { SelectOption } from '../types'

export const suppliers: SelectOption<number>[] = [
  { label: '山田商事株式会社', value: 1 },
  { label: '鈴木物産', value: 2 },
  { label: '田中製作所', value: 3 },
  { label: '佐藤電機工業', value: 4 },
  { label: '高橋化学', value: 5 },
  { label: '伊藤金属', value: 6 },
  { label: '渡辺食品', value: 7 },
  { label: '中村運輸', value: 8 },
  { label: '小林機械', value: 9 },
  { label: '加藤建設', value: 10 },
  { label: '松本精密工業', value: 11 },
  { label: '井上テクノロジー', value: 12 },
  { label: '木村包装', value: 21 },
  { label: '林プラスチック', value: 22 },
  { label: '清水電子部品', value: 31 },
  { label: '森川ロジスティクス', value: 32 },
  { label: '池田化成', value: 41 },
  { label: '橋本工業', value: 42 },
  { label: '藤田産業', value: 52 },
]

export const warehouses: SelectOption<number>[] = [
  { label: '東京本社倉庫', value: 1 },
  { label: '大阪支店倉庫', value: 2 },
  { label: '名古屋物流センター', value: 3 },
  { label: '福岡配送センター', value: 4 },
  { label: '札幌倉庫', value: 5 },
]

export const staffMembers: SelectOption<number>[] = [
  { label: '山田太郎', value: 1 },
  { label: '鈴木花子', value: 2 },
  { label: '田中一郎', value: 3 },
  { label: '佐藤美咲', value: 4 },
  { label: '高橋健二', value: 5 },
  { label: '伊藤直子', value: 6 },
  { label: '渡辺隆', value: 7 },
  { label: '中村由美', value: 8 },
]

export const paymentTerms: SelectOption<number>[] = [
  { label: '月末締め翌月末払い', value: 1 },
  { label: '月末締め翌々月末払い', value: 2 },
  { label: '20日締め翌月末払い', value: 3 },
  { label: '都度払い', value: 4 },
  { label: '前払い', value: 5 },
]

export const deliveryMethods: SelectOption<number>[] = [
  { label: '通常配送', value: 1 },
  { label: '急送', value: 2 },
  { label: 'チャーター便', value: 3 },
  { label: '直送（メーカー出荷）', value: 4 },
  { label: '引取り', value: 5 },
]

export const priorities: SelectOption<number>[] = [
  { label: '通常', value: 1 },
  { label: '急ぎ', value: 2 },
  { label: '至急', value: 3 },
]

export const currencies: SelectOption<number>[] = [
  { label: 'JPY（日本円）', value: 1 },
  { label: 'USD（米ドル）', value: 2 },
  { label: 'EUR（ユーロ）', value: 3 },
  { label: 'CNY（人民元）', value: 4 },
]

export const orderTypes: SelectOption<number>[] = [
  { label: '通常発注', value: 1 },
  { label: '緊急発注', value: 2 },
  { label: '定期発注', value: 3 },
  { label: '分納発注', value: 4 },
]

export const departments: SelectOption<number>[] = [
  { label: '購買部', value: 1 },
  { label: '製造部', value: 2 },
  { label: '営業部', value: 3 },
  { label: '総務部', value: 4 },
  { label: '品質管理部', value: 5 },
]

export const fieldOrder = [
  // 基本情報（3列: 160px 1fr 1fr）
  'orderDate',
  'supplier',
  'staff',
  'warehouse',
  'orderType',
  'department',
  // 明細（5列: 商品コード 単価 数量 金額 備考）
  'productCode1',
  'unitPrice1',
  'quantity1',
  'amount1',
  'remark1',
  // 配送・支払（4列: 160px 1fr 1fr 120px）
  'deliveryDate',
  'paymentTerm',
  'deliveryMethod',
  'priority',
  'currency',
  'approver',
  'generalRemark',
]
