export interface TableRow {
  id: number
  name: string
  age: number
  department: string
  status: '在籍' | '休職' | '退職'
  salary: number
  joinDate: string
  email: string
}

export const tableData: TableRow[] = [
  { id: 1, name: '田中太郎', age: 32, department: '開発', status: '在籍', salary: 5500000, joinDate: '2018-04-01', email: 'tanaka@example.com' },
  { id: 2, name: '鈴木花子', age: 28, department: '営業', status: '在籍', salary: 4800000, joinDate: '2020-04-01', email: 'suzuki@example.com' },
  { id: 3, name: '佐藤健一', age: 45, department: '人事', status: '在籍', salary: 7200000, joinDate: '2010-04-01', email: 'sato@example.com' },
  { id: 4, name: '山田美咲', age: 26, department: '開発', status: '在籍', salary: 4200000, joinDate: '2022-04-01', email: 'yamada@example.com' },
  { id: 5, name: '高橋翔', age: 35, department: '経理', status: '休職', salary: 5800000, joinDate: '2016-04-01', email: 'takahashi@example.com' },
  { id: 6, name: '渡辺裕子', age: 41, department: 'マーケティング', status: '在籍', salary: 6500000, joinDate: '2012-04-01', email: 'watanabe@example.com' },
  { id: 7, name: '伊藤大輔', age: 29, department: '開発', status: '在籍', salary: 4600000, joinDate: '2021-04-01', email: 'ito@example.com' },
  { id: 8, name: '小林真理', age: 38, department: '営業', status: '退職', salary: 5200000, joinDate: '2014-04-01', email: 'kobayashi@example.com' },
  { id: 9, name: '加藤隆', age: 50, department: '人事', status: '在籍', salary: 8000000, joinDate: '2005-04-01', email: 'kato@example.com' },
  { id: 10, name: '吉田恵', age: 24, department: '開発', status: '在籍', salary: 3800000, joinDate: '2024-04-01', email: 'yoshida@example.com' },
  { id: 11, name: '松本一郎', age: 33, department: '経理', status: '在籍', salary: 5100000, joinDate: '2019-04-01', email: 'matsumoto@example.com' },
  { id: 12, name: '井上さくら', age: 27, department: 'マーケティング', status: '在籍', salary: 4400000, joinDate: '2021-10-01', email: 'inoue@example.com' },
]
