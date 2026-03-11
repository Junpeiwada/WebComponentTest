# UI ライブラリ入力コンポーネント比較アプリ 仕様書

## 概要

MUI (Material UI) と Ant Design の入力系コンポーネントを、同一ページ上で横並びに比較できる Web アプリケーション。
各コンポーネントの見た目・バリデーション・カスタマイズ性の違いを実際に操作して確認できる。

---

## 技術スタック

| 項目 | 技術 |
|---|---|
| フレームワーク | React 19 |
| ビルドツール | Vite 7 |
| 言語 | TypeScript |
| UIライブラリ | MUI (`@mui/material`, `@mui/x-date-pickers`, `@mui/x-data-grid`) / Ant Design (`antd`) |
| CSS-in-JS | Emotion (`@emotion/react`, `@emotion/styled`) |
| 数値フォーマット | react-number-format（MUI側で使用） |
| 日付ライブラリ | dayjs（MUI・Ant Design共通） |
| デプロイ | GitHub Pages（GitHub Actions で自動デプロイ） |

---

## ページ構成

**サイドバー + メインコンテンツ構成（タブ切替式）**

```
┌──────────────────────────────────────────────────────────────┐
│  AppBar: UI 入力コンポーネント比較 — MUI vs Ant Design       │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                 │
│  サイドバー │  メインコンテンツ                                │
│  (220px)   │                                                 │
│            │  ■ セクションタイトル + 説明                      │
│  ┌────────┐│                                                 │
│  │日付入力 ││  ┌──────────────┐  ┌──────────────┐            │
│  │時刻入力 ││  │  MUI          │  │  Ant Design  │            │
│  │数値入力 ││  │  (各パターン  │  │  (各パターン  │            │
│  │文字列   ││  │   縦並び)     │  │   縦並び)     │            │
│  │Auto…    ││  └──────────────┘  └──────────────┘            │
│  │テーブル ││                                                 │
│  └────────┘│  ※テーブルタブのみ MUI/Antd タブ切替表示         │
│            │                                                 │
│  ─────────│                                                 │
│  Theme     │                                                 │
│  ┌────────┐│                                                 │
│  │カラー   ││                                                 │
│  │角丸     ││                                                 │
│  │フォント ││                                                 │
│  │高さ     ││                                                 │
│  │リセット ││                                                 │
│  └────────┘│                                                 │
└────────────┴─────────────────────────────────────────────────┘
```

### タブ一覧

| タブ | 説明 |
|---|---|
| 日付入力 | カレンダーの有無、フォーマット、範囲制限などのバリエーション |
| 時刻入力 | 24時間制/12時間制、ステップ指定、ピッカーの有無 |
| 数値入力 | カンマ区切り、小数点、パーセント、通貨、範囲制限、ステッパー |
| 文字列入力 | 基本テキスト、文字数制限、パスワード、TextArea、prefix/suffix、エラー表示 |
| Autocomplete | label/valueマッピング、freeSolo、複数選択、グループ化、非同期読み込み |
| テーブル | ソート、フィルタ、ページネーション、行選択、カスタムレンダー |

### テーマ調整機能

サイドバー下部にリアルタイムでMUI・Ant Design両方のテーマを一括変更できる設定UIを配置。

| 設定項目 | 範囲 | デフォルト |
|---|---|---|
| プライマリカラー | カラーピッカー | `#1677ff` |
| 角丸 (borderRadius) | 0〜20px | 6px |
| フォントサイズ | 10〜18px | 14px |
| コントロール高さ | 24〜44px | 32px |

---

## コンポーネント別仕様

### 送信値の表示

各入力パターンの下に `ValueDisplay` コンポーネントで **送信値（内部値）** をリアルタイム表示する。
未入力時は `(未入力)` と表示される。

```
送信値: "2026-01-01"
送信値: 1234567
送信値: (未入力)
```

---

### 1. 日付入力 (DatePicker)

| 項目 | MUI | Ant Design |
|---|---|---|
| コンポーネント | `@mui/x-date-pickers/DatePicker` | `antd/DatePicker` |
| 日付ライブラリ | dayjs (AdapterDayjs) | dayjs (標準) |

**バリエーション:**

| パターン | 説明 |
|---|---|
| 柔軟な日付入力 | カスタム実装。数字のみ(MMDD/YYMMDD/YYYYMMDD)や区切りあり(M/D, YY/M/D, YYYY/M/D)の多様なフォーマットに対応。フォーカスを外す or Enter で変換。カレンダーアイコンからのピッカー選択も可能 |
| カレンダーあり（デフォルト） | YYYY/MM/DD フォーマット。アイコンクリックでカレンダーポップアップ |
| カレンダーなし（手入力のみ） | MUI: `slots={{ openPickerButton: () => null }}`、Antd: `open={false}` で実現 |
| YYYY-MM-DD フォーマット | ハイフン区切り |
| YYYY年MM月DD日 フォーマット | 日本語フォーマット |
| 範囲制限付き | 2026/01/01 〜 2026/12/31 で制限 |
| 初期値あり（今日） | 今日の日付を初期値として設定 |

**柔軟な日付入力の詳細:**

カスタムフック `useFlexDateInput` と日付パーサー `parseDateInput` による独自実装。

```
入力例:
  数字のみ: 0101 → 今年01/01, 250203 → 2025/02/03, 20260101 → 2026/01/01
  区切りあり: 1/1 → 今年01/01, 25/7/4 → 2025/07/04, 2026/8/9 → 2026/08/09
  2桁年: 常に2000年代（20XX）として解釈
```

MUI版は `FlexDateInputMui`（`TextField` + 非表示 `DatePicker`）、Antd版は `FlexDateInputAntd`（`Input` + 非表示 `DatePicker`）で実装。

---

### 2. 時刻入力 (TimePicker)

| 項目 | MUI | Ant Design |
|---|---|---|
| コンポーネント | `@mui/x-date-pickers/TimePicker` | `antd/TimePicker` |

**バリエーション:**

| パターン | 説明 |
|---|---|
| 時刻ピッカーあり（HH:mm） | 24時間制・分まで |
| 秒まで（HH:mm:ss） | views に seconds を追加 |
| 12時間制（AM/PM） | `ampm` プロパティ使用 |
| 手入力のみ（ピッカーなし） | MUI: `slots={{ openPickerButton: () => null }}`、Antd: 同様の手法 |
| 15分刻み | `minutesStep={15}` |
| 30分刻み | `minutesStep={30}` |

---

### 3. 数値入力

| 項目 | MUI | Ant Design |
|---|---|---|
| コンポーネント | `TextField` + `react-number-format` (`NumericFormat`) | `InputNumber` |
| カンマ区切り | `thousandSeparator` で実現 | `formatter`/`parser` で実現 |

**バリエーション:**

| パターン | 説明 |
|---|---|
| カンマ区切り整数 | `1,234,567` |
| カンマ区切り+小数点（2桁） | `1,234.56`（`fixedDecimalScale`） |
| 小数点のみ（カンマなし） | `1234.56` |
| パーセント入力 | `85.5%`（suffix で実現） |
| 通貨入力（円） | `¥1,234,567`（prefix で実現） |
| 範囲制限（0〜100） | `isAllowed` で入力時にリアルタイム制限 |
| マイナス値許可 | `allowNegative` |
| ステッパー付き | MUI: `type="number"` + step/min/max、Antd: `InputNumber` の標準ステッパー |

---

### 4. 文字列入力

| 項目 | MUI | Ant Design |
|---|---|---|
| コンポーネント | `TextField` | `Input` |

**バリエーション:**

| パターン | 説明 |
|---|---|
| 基本テキスト | floating label 付き（MUI の `label` プロパティ） |
| 文字数制限付き（20文字） | MUI: `maxLength` + `helperText` で残り文字数表示、Antd: `showCount` |
| パスワード入力 | MUI: `type` 切替 + 表示トグルボタン、Antd: `Input.Password` |
| 複数行（TextArea） | MUI: `multiline rows={3}`、Antd: `TextArea` |
| prefix/suffix 付き | MUI: `InputAdornment`、Antd: `prefix`/`suffix` プロパティ |
| disabled | 非活性状態 |
| readonly | 読み取り専用 |
| エラー表示 | 5文字以上でエラー。MUI: `error` + `helperText`、Antd: `status="error"` |

---

### 5. Autocomplete

| 項目 | MUI | Ant Design |
|---|---|---|
| コンポーネント | `Autocomplete` | `AutoComplete` / `Select` (showSearch) |

**バリエーション:**

| パターン | 説明 |
|---|---|
| コード入力 | カスタムコンポーネント（`MuiCodeInput` / `AntdCodeInput`）。値を入力すると「値:ラベル」形式で自動補完。候補が1つに絞り込まれると自動確定。確定後バックスペースで全クリア→再入力。blur時に未確定なら入力クリア |
| 基本（label/value マッピング） | はい/いいえオプション。表示は `label`、送信は `value` |
| 自由入力許可 (freeSolo) | 候補にない値も入力可能。都道府県リストを使用 |
| 自由入力不許可 | 候補からのみ選択 |
| 複数選択 | MUI: `Chip` 表示、Antd: `Tag` 表示 |
| グループ化（地方別） | 都道府県を地方別にグルーピング表示 |
| 非同期データ読み込み | ドロップダウン展開時に1.5秒遅延でデータ読み込みをシミュレート。ローディング表示付き |

**コード入力コンポーネントの詳細:**

```
入力: "1" → 候補が1つに絞られ自動確定 → 表示: "1:いいえ" → 送信値: 1
入力: "2" → 候補が1つに絞られ自動確定 → 表示: "2:はい" → 送信値: 2
バックスペース → 全クリア → 再入力可能
blur時に未確定 → 入力クリア
```

---

### 6. テーブル (Table)

テーブルタブのみ、MUI / Ant Design をタブで切り替えて表示（横並びではなく単独表示）。

| 項目 | MUI | Ant Design |
|---|---|---|
| コンポーネント | `@mui/x-data-grid/DataGrid` | `antd/Table` |
| ライセンス | Community（無料版） | 全機能無料 |

**共通カラム:** ID、名前、年齢、部署、ステータス、給与、入社日、メール

**MUI DataGrid:**

| 機能 | 説明 |
|---|---|
| 基本テーブル | ソート・ページネーション（5/10/25行）、コンパクト表示 |
| 行選択 | チェックボックスによる複数行選択 |
| カスタムレンダー | ステータスバッジ（色分け）、給与フォーマット（¥1,234,567） |
| 備考 | 列リサイズ・列順序入替・列グループ・ツリーデータ・集計行は **有料版（Pro/Premium）が必要** |

**Ant Design Table:**

| 機能 | 説明 |
|---|---|
| 基本テーブル | ソート・フィルター（部署・ステータス）・ページネーション（5/10/25行）、コンパクト表示 |
| 行選択 + テキスト検索 | チェックボックス選択 + `Input.Search` による名前・部署・メール検索 |
| カスタムレンダー | ステータス `Tag`（色分け）、給与フォーマット |
| 備考 | ソート・フィルタ・ページネーション・行選択・仮想スクロール・展開行・ツリーデータ・固定列/ヘッダーは全て **無料版で利用可能** |

---

## サンプルデータ

### 値マッピング用（Autocomplete）

```ts
// はい/いいえ
export const yesNoOptions: SelectOption<number>[] = [
  { label: 'いいえ', value: 1 },
  { label: 'はい',   value: 2 },
]

// ステータス
export const statusOptions: SelectOption<number>[] = [
  { label: '未処理', value: 0 },
  { label: '処理中', value: 1 },
  { label: '完了',   value: 2 },
  { label: 'エラー', value: 9 },
]

// 優先度（グループ化用）
export const priorityOptions: GroupedSelectOption<number>[] = [
  { label: '緊急', value: 1, group: '高優先' },
  { label: '重要', value: 2, group: '高優先' },
  { label: '通常', value: 3, group: '中優先' },
  { label: '低い', value: 4, group: '低優先' },
  { label: '未定', value: 5, group: '低優先' },
]
```

### 都道府県リスト（Autocomplete グループ化用）

```ts
export const prefectures: PrefectureOption[] = [
  { label: '北海道', value: 'hokkaido', region: '北海道' },
  { label: '青森県', value: 'aomori',   region: '東北' },
  { label: '東京都', value: 'tokyo',    region: '関東' },
  { label: '大阪府', value: 'osaka',    region: '近畿' },
  // ... 全47都道府県
]
```

### テーブル用データ

```ts
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

// 12件の社員サンプルデータ
```

---

## 型定義

```ts
export interface SelectOption<T = number | string> {
  label: string
  value: T
}

export interface GroupedSelectOption<T = number | string> extends SelectOption<T> {
  group: string
}

export interface PrefectureOption {
  label: string
  value: string
  region: string
}
```

---

## ディレクトリ構成

```
src/
├── App.tsx                          # メインレイアウト（AppBar + Drawer + タブ切替 + テーマ管理）
├── main.tsx                         # エントリポイント
├── components/
│   ├── ComparisonRow.tsx            # MUI/Antd横並びの2カラムラッパー
│   ├── SectionHeader.tsx            # セクション見出し
│   ├── ValueDisplay.tsx             # 送信値のリアルタイム表示
│   ├── common/
│   │   ├── FlexDateInputMui.tsx     # 柔軟な日付入力（MUI版）
│   │   └── FlexDateInputAntd.tsx    # 柔軟な日付入力（Ant Design版）
│   ├── mui/
│   │   ├── MuiDateInput.tsx         # DatePicker（複数パターン）
│   │   ├── MuiTimeInput.tsx         # TimePicker（複数パターン）
│   │   ├── MuiNumberInput.tsx       # 数値入力（NumericFormat使用）
│   │   ├── MuiTextInput.tsx         # テキスト入力（複数パターン）
│   │   ├── MuiAutocomplete.tsx      # Autocomplete（複数パターン）
│   │   ├── MuiCodeInput.tsx         # コード入力（自動確定ロジック）
│   │   └── MuiTable.tsx             # DataGrid テーブル
│   └── antd/
│       ├── AntdDateInput.tsx
│       ├── AntdTimeInput.tsx
│       ├── AntdNumberInput.tsx
│       ├── AntdTextInput.tsx
│       ├── AntdAutocomplete.tsx
│       ├── AntdCodeInput.tsx
│       └── AntdTable.tsx
├── hooks/
│   └── useFlexDateInput.ts          # 柔軟な日付入力のカスタムフック
├── utils/
│   └── parseDateInput.ts            # 日付フォーマット解析ユーティリティ
├── data/
│   ├── sampleData.ts                # 選択肢データ（はい/いいえ、ステータス、優先度、都道府県）
│   └── tableData.ts                 # テーブル用サンプルデータ（社員12件）
└── types/
    └── index.ts                     # 共通型定義（SelectOption, GroupedSelectOption 等）
```

---

## 備考

- 状態管理は React の `useState` のみ（外部状態管理ライブラリ不要）
- MUI テーマは `createTheme` + `ThemeProvider` で適用
- Ant Design テーマは `ConfigProvider` の `theme` プロパティで適用
- 両テーマをサイドバーのスライダーで動的に変更可能
- 日本語ロケール設定済み（MUI: `adapterLocale="ja"` + `dayjs/locale/ja`、Antd: `antd/locale/ja_JP`）
- レスポンシブ対応（`xs` で1カラム、`lg` で2カラム並列表示）
- GitHub Pages 対応（Vite の `base` 設定 + GitHub Actions ワークフロー）
