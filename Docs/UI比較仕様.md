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
| 言語 | TypeScript (strict mode) |
| UIライブラリ | MUI (`@mui/material`, `@mui/x-date-pickers`, `@mui/x-data-grid`) / Ant Design (`antd`) |
| CSS-in-JS | Emotion (`@emotion/react`, `@emotion/styled`) |
| 数値フォーマット | react-number-format（MUI側で使用） |
| 日付ライブラリ | dayjs（MUI・Ant Design共通） |
| ルーティング | react-router（URL: `/:tabKey`） |
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
│  │CD入力   ││  ※テーブル・発注入力タブは MUI/Antd タブ切替表示  │
│  │発注入力 ││                                                 │
│  └────────┘│                                                 │
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

| タブ | URL | 説明 | 表示形式 |
|---|---|---|---|
| 日付入力 | `/date` | カレンダーの有無、フォーマット、範囲制限などのバリエーション | 横並び比較 |
| 時刻入力 | `/time` | 24時間制/12時間制、ステップ指定、ピッカーの有無 | 横並び比較 |
| 数値入力 | `/number` | カンマ区切り、小数点、パーセント、通貨、範囲制限、ステッパー | 横並び比較 |
| 文字列入力 | `/text` | 基本テキスト、文字数制限、パスワード、TextArea、prefix/suffix、エラー表示 | 横並び比較 |
| Autocomplete | `/autocomplete` | label/valueマッピング、freeSolo、複数選択、グループ化、非同期読み込み | 横並び比較 |
| テーブル | `/table` | ソート、フィルタ、ページネーション、行選択、カスタムレンダー | タブ切替 |
| CD入力 | `/code` | 商品コード検索、モーダル検索、エラー制御、長いエラーメッセージの表示 | 横並び比較 |
| 発注入力 | `/order` | Enterキーによるフォーカス制御デモ — 発注入力フォーム | タブ切替 |

- **横並び比較**: `ComparisonRow` で MUI / Ant Design を2カラム表示（`xs`: 1カラム、`lg`: 2カラム）
- **タブ切替**: MUI / Ant Design をタブで切り替えて単独表示（テーブル・発注入力は画面幅が必要なため）

### ルーティング

React Router を使用。`/:tabKey` 形式のURLで各タブに直接アクセス可能。`/` はデフォルトで `/date` にリダイレクト。

### テーマ調整機能

サイドバー下部にリアルタイムでMUI・Ant Design両方のテーマを一括変更できる設定UIを配置。

| 設定項目 | 範囲 | デフォルト |
|---|---|---|
| プライマリカラー | カラーピッカー | `#1677ff` |
| 角丸 (borderRadius) | 0〜20px | 6px |
| フォントサイズ | 10〜18px | 14px |
| コントロール高さ | 24〜44px | 32px |

---

## ディレクトリ構成

```
src/
├── App.tsx                          # メインレイアウト（AppBar + Drawer + タブ切替 + テーマ管理 + ルーティング）
├── main.tsx                         # エントリポイント
├── components/
│   ├── ComparisonRow.tsx            # MUI/Antd横並びの2カラムラッパー（maxWidth: 480px）
│   ├── SectionHeader.tsx            # セクション見出し（未使用）
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
│   │   ├── MuiTable.tsx             # DataGrid テーブル
│   │   ├── MuiProductCodeInput.tsx  # 商品コード入力（検索ダイアログ付き）
│   │   ├── MuiProductCodeDemo.tsx   # 商品コード入力デモ画面
│   │   └── MuiOrderForm.tsx         # 発注入力フォーム
│   └── antd/
│       ├── AntdDateInput.tsx
│       ├── AntdTimeInput.tsx
│       ├── AntdNumberInput.tsx
│       ├── AntdTextInput.tsx
│       ├── AntdAutocomplete.tsx
│       ├── AntdCodeInput.tsx
│       ├── AntdTable.tsx
│       ├── AntdProductCodeInput.tsx
│       ├── AntdProductCodeDemo.tsx
│       └── AntdOrderForm.tsx
├── hooks/
│   ├── useFlexDateInput.ts          # 柔軟な日付入力のカスタムフック
│   └── useFieldNavigation.tsx       # フィールドナビゲーション（Enterキー移動基盤）
├── utils/
│   └── parseDateInput.ts            # 日付フォーマット解析ユーティリティ
├── data/
│   ├── sampleData.ts                # 選択肢データ（はい/いいえ、ステータス、優先度、都道府県）
│   ├── tableData.ts                 # テーブル用サンプルデータ（社員12件）
│   ├── orderFormData.ts             # 発注フォーム用マスタデータ（仕入先、倉庫、担当者等）
│   └── products.json                # 商品マスタ（コード、商品名、単価）
└── types/
    └── index.ts                     # 共通型定義（SelectOption, Product 等）
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
- React Router によるURL直接アクセス対応
