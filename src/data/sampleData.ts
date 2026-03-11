import type { SelectOption, GroupedSelectOption, PrefectureOption } from '../types'

// はい/いいえ
export const yesNoOptions: SelectOption<number>[] = [
  { label: 'いいえ', value: 1 },
  { label: 'はい', value: 2 },
  { label: '不明', value: 22 },
  { label: '該当なし', value: 44 },
]

// ステータス
export const statusOptions: SelectOption<number>[] = [
  { label: '未処理', value: 0 },
  { label: '処理中', value: 1 },
  { label: '完了', value: 2 },
  { label: 'エラー', value: 9 },
]

// 優先度（グループ化Select用）
export const priorityOptions: GroupedSelectOption<number>[] = [
  { label: '緊急', value: 1, group: '高優先' },
  { label: '重要', value: 2, group: '高優先' },
  { label: '通常', value: 3, group: '中優先' },
  { label: '低い', value: 4, group: '低優先' },
  { label: '未定', value: 5, group: '低優先' },
]

// 都道府県
export const prefectures: PrefectureOption[] = [
  { label: '北海道', value: 'hokkaido', region: '北海道' },
  { label: '青森県', value: 'aomori', region: '東北' },
  { label: '岩手県', value: 'iwate', region: '東北' },
  { label: '宮城県', value: 'miyagi', region: '東北' },
  { label: '秋田県', value: 'akita', region: '東北' },
  { label: '山形県', value: 'yamagata', region: '東北' },
  { label: '福島県', value: 'fukushima', region: '東北' },
  { label: '茨城県', value: 'ibaraki', region: '関東' },
  { label: '栃木県', value: 'tochigi', region: '関東' },
  { label: '群馬県', value: 'gunma', region: '関東' },
  { label: '埼玉県', value: 'saitama', region: '関東' },
  { label: '千葉県', value: 'chiba', region: '関東' },
  { label: '東京都', value: 'tokyo', region: '関東' },
  { label: '神奈川県', value: 'kanagawa', region: '関東' },
  { label: '新潟県', value: 'niigata', region: '中部' },
  { label: '富山県', value: 'toyama', region: '中部' },
  { label: '石川県', value: 'ishikawa', region: '中部' },
  { label: '福井県', value: 'fukui', region: '中部' },
  { label: '山梨県', value: 'yamanashi', region: '中部' },
  { label: '長野県', value: 'nagano', region: '中部' },
  { label: '岐阜県', value: 'gifu', region: '中部' },
  { label: '静岡県', value: 'shizuoka', region: '中部' },
  { label: '愛知県', value: 'aichi', region: '中部' },
  { label: '三重県', value: 'mie', region: '近畿' },
  { label: '滋賀県', value: 'shiga', region: '近畿' },
  { label: '京都府', value: 'kyoto', region: '近畿' },
  { label: '大阪府', value: 'osaka', region: '近畿' },
  { label: '兵庫県', value: 'hyogo', region: '近畿' },
  { label: '奈良県', value: 'nara', region: '近畿' },
  { label: '和歌山県', value: 'wakayama', region: '近畿' },
  { label: '鳥取県', value: 'tottori', region: '中国' },
  { label: '島根県', value: 'shimane', region: '中国' },
  { label: '岡山県', value: 'okayama', region: '中国' },
  { label: '広島県', value: 'hiroshima', region: '中国' },
  { label: '山口県', value: 'yamaguchi', region: '中国' },
  { label: '徳島県', value: 'tokushima', region: '四国' },
  { label: '香川県', value: 'kagawa', region: '四国' },
  { label: '愛媛県', value: 'ehime', region: '四国' },
  { label: '高知県', value: 'kochi', region: '四国' },
  { label: '福岡県', value: 'fukuoka', region: '九州' },
  { label: '佐賀県', value: 'saga', region: '九州' },
  { label: '長崎県', value: 'nagasaki', region: '九州' },
  { label: '熊本県', value: 'kumamoto', region: '九州' },
  { label: '大分県', value: 'oita', region: '九州' },
  { label: '宮崎県', value: 'miyazaki', region: '九州' },
  { label: '鹿児島県', value: 'kagoshima', region: '九州' },
  { label: '沖縄県', value: 'okinawa', region: '沖縄' },
]
