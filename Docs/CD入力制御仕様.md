# CD入力制御コンポーネント 仕様書

## 概要

本プロジェクトには2種類のCD入力コンポーネントが存在する。

1. **汎用コード入力（CodeInput）** — `SelectOption[]`を受け取り、コード値の入力・自動補完を行うAutocomplete型コンポーネント
2. **商品コード入力（ProductCodeInput）** — 商品マスタ（products.json）に対するコード入力・検索ダイアログ付きコンポーネント

いずれもMUI版・Ant Design版の両方を実装し、横並びで比較可能。

---

## 1. 汎用コード入力（CodeInput）

### コンポーネント構成

```
┌─────────────────────────────────────────────┐
│  コード入力                                   │
│  ┌─────────────────────────────────┐        │
│  │ 1:いいえ  ▼ (Autocomplete)      │        │
│  └─────────────────────────────────┘        │
│  ドロップダウンに「値:ラベル」形式で候補表示    │
└─────────────────────────────────────────────┘
```

### Props定義

```ts
function MuiCodeInput<T extends number | string>({
  options: SelectOption<T>[]
  placeholder?: string
  onChange: (value: T | null) => void
})
```

```ts
interface SelectOption<T = number | string> {
  label: string
  value: T
}
```

### 表示形式

- 選択肢は `値:ラベル` 形式で表示（例：`1:いいえ`、`2:はい`）

### フィルタリング

| 条件 | 方式 |
|---|---|
| コード値 | 前方一致（`String(value).startsWith(input)`） |
| ラベル | 部分一致（`label.includes(input)`） |

### 確定ロジック

| トリガー | 動作 |
|---|---|
| ドロップダウンから選択 | 即確定（`値:ラベル`を表示） |
| blur時 | マッチ候補が1つならその候補で自動確定。0個または2個以上なら入力をクリア |
| 完全一致優先 | コード値の完全一致があればそれを選択、なければ最初の候補 |

### フォーカス制御

| 操作 | 動作 |
|---|---|
| フォーカス取得 | `select()` で全テキスト選択 |
| 確定済み状態でBackspace/Delete | 全クリアして再入力可能にする |

### MUI版の実装

- `@mui/material/Autocomplete` を使用
- `freeSolo` プロップで自由入力を許可
- `inputValue` + `onInputChange` で入力状態を管理
- `lastKeyRef` でBackspace/Deleteキーを追跡
- `confirmed` フラグでフォーカス状態と確定状態を個別管理

### Ant Design版の実装

- `antd/AutoComplete` を使用
- MUI版と同じロジック構造で統一

---

## 2. 商品コード入力（ProductCodeInput）

### コンポーネント構成

```
┌──────────────────────────────────────────────────────┐
│  商品CD入力                                           │
│  ┌──────────┐ ┌──┐ ┌────────────────────────────┐   │
│  │ 商品コード│ │🔍│ │ 商品名（読み取り専用）       │   │
│  │ (数値入力)│ │  │ │                             │   │
│  └──────────┘ └──┘ └────────────────────────────┘   │
│  F2: 検索ダイアログ  (またはエラーメッセージ表示)      │
└──────────────────────────────────────────────────────┘
```

| 要素 | 説明 |
|---|---|
| 商品コード入力 | 数値入力フィールド（右寄せ、幅95px） |
| 検索ボタン | クリックまたはF2キーで検索ダイアログを開く |
| 商品名表示 | 読み取り専用。ヒットした商品名をテキスト表示 |
| ヘルパーテキスト | 通常時は「F2: 検索ダイアログ」、エラー時はエラーメッセージ |

### Props定義

```ts
interface ProductCodeInputProps {
  value: number | null
  onChange: (code: number | null, name: string) => void
}
```

### 操作フロー

#### フロー1: 商品コード直接入力

```
[商品コード入力] → フォーカスアウト(blur)
    ├── 一致する商品あり → 商品名を表示、エラー解除
    └── 一致する商品なし → エラー状態（赤枠＋エラーメッセージ）、商品名はクリア
    └── 空入力時 → エラーにしない、商品名もクリア
```

1. ユーザーが商品コード入力フィールドに数値を入力する
2. **フォーカスアウト（blur）** をトリガーに商品マスタ（JSON）で検索を実行する
3. **ヒットした場合**: 商品名を表示し、`onChange(code, name)` を発火
4. **ヒットしなかった場合**: エラー状態にし、長いエラーメッセージを表示

> **注意**: Enterキーでの確定は行わない（blur時のみ）。EnterキーはフォーカスをF2キー検索ダイアログとして使用しない。

#### フロー2: 検索ダイアログによる検索

```
[検索ボタン or F2キー] → ダイアログオープン（全件表示）
    → コードまたは商品名を入力するとリアルタイムにテーブルが絞り込まれる
    → ↑↓キーで行選択 → Enterで確定
    → または行クリックで確定
    → ダイアログクローズ
    → 商品コード入力に値セット、商品名を表示
```

### 商品コード入力フィールド詳細

| 項目 | 仕様 |
|---|---|
| 入力形式 | 数値のみ（`/^\d+$/` でバリデーション） |
| 表示 | 右寄せ（`textAlign: 'right'`） |
| 幅 | 95px |
| inputMode | `numeric`（モバイルで数字キーボード表示） |
| 確定トリガー | フォーカスアウト（blur）のみ |
| エラー状態 | 存在しないコード入力時に赤枠 + エラーメッセージ表示 |
| エラー解除 | 値を変更し始めた時点でエラーを解除する |
| 空入力時 | エラーにしない（商品名もクリア） |
| フォーカス取得時 | 全選択（`e.target.select()`） |
| F2キー | 検索ダイアログを開く |

### IME（日本語入力）対応

| 項目 | 仕様 |
|---|---|
| compositionStart | `composingRef` をtrueに設定、入力値はそのまま反映 |
| compositionEnd | `composingRef` をfalseに設定、非数字文字を除去（`replace(/\D/g, '')`） |
| composition中 | バリデーション（数字チェック）をスキップ |

### エラーメッセージ

エラー時に以下の長いメッセージを表示（長いエラーメッセージ表示のデモ用途）：

```
【長いエラーメッセージのデモ】存在しない商品コードです。入力された値はマスタに登録されていません。
正しい商品コードを入力するか、F2キーで検索ダイアログを開いて商品を選択してください。
なお、新規商品の場合は先に商品マスタへの登録が必要です。
```

### 検索ダイアログ仕様

#### レイアウト

```
┌──────────────────────────────────────┐
│  商品検索                       [×]  │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │
│  │ コードまたは商品名で絞り込み    │ │
│  │ （↑↓で選択、Enterで確定）      │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 商品コード │ 商品名          │   │
│  ├────────────┼─────────────────┤   │
│  │     1      │ ボールペン（黒）│   │  ← 行クリック or Enter確定
│  │     2      │ ボールペン（赤）│   │  ← マウスホバーでハイライト
│  │     3      │ シャープペンシル│   │
│  │   ...      │ ...             │   │
│  └──────────────────────────────┘   │
│  (高さ400px、スクロール可能)          │
│                                      │
└──────────────────────────────────────┘
```

#### ダイアログ内動作

| 項目 | 仕様 |
|---|---|
| 検索方式 | コード値の部分一致 + 商品名の部分一致（インクリメンタルサーチ） |
| 結果表示 | テーブル形式（商品コード列・商品名列） |
| 該当なし | 「該当する商品がありません」メッセージ表示 |
| 確定方法 | テーブルの行をクリック / ↑↓キーで選択しEnter |
| マウスホバー | ホバーした行がハイライトされる（`onMouseEnter`でハイライトインデックス更新） |
| 初期状態 | 検索フィールド空欄・フォーカス済み、テーブルは全件表示、先頭行がハイライト |
| 閉じる | ×ボタン / モーダル外クリック / Escキー |
| スクロール | ↑↓キー操作時に選択行が自動的にビューポート内にスクロール（`scrollIntoView`） |
| IME対応 | `isComposing` 中はキーボード操作（↑↓Enter）を無視 |

---

## 商品データ

### データ形式

```ts
interface Product {
  code: number
  name: string
  unitPrice: number
}
```

### データソース

JSONファイル (`src/data/products.json`) に100件のデモデータを格納。

```json
[
  { "code": 1, "name": "ボールペン（黒）", "unitPrice": 150 },
  { "code": 2, "name": "ボールペン（赤）", "unitPrice": 150 },
  { "code": 3, "name": "ボールペン（青）", "unitPrice": 150 },
  { "code": 4, "name": "シャープペンシル", "unitPrice": 300 },
  { "code": 5, "name": "シャープペン替芯 0.5mm", "unitPrice": 120 },
  ...
]
```

---

## MUI版・Ant Design版の実装差異

### CodeInput（汎用コード入力）

| 要素 | MUI版 | Ant Design版 |
|---|---|---|
| 基本コンポーネント | `@mui/material/Autocomplete` | `antd/AutoComplete` |
| 入力フィールド | `TextField` | `Input` |
| 自由入力 | `freeSolo` prop | デフォルトで可能 |

### ProductCodeInput（商品コード入力）

| 要素 | MUI版 | Ant Design版 |
|---|---|---|
| 商品コード入力 | `TextField` | `Input`（antd `InputRef`） |
| 検索ボタン | `Button` + `SearchIcon` | `Button` + `SearchOutlined` |
| 商品名表示 | `Typography` | `span` タグ |
| 検索ダイアログ | `Dialog` + `Table` | `Modal` + `Table` |
| スクロール管理 | `useRef<Map>` で行参照保持 | `querySelectorAll('tbody tr')` で行取得 |
| 行ハイライト | `TableRow` の `selected` prop | カスタムCSS（`.ant-table-row-highlight`） |
| エラー表示 | `TextField` の `error` prop + `Typography color="error"` | `status="error"` + `div style={{ color: '#ff4d4f' }}` |

---

## ファイル構成

```
src/
├── data/
│   └── products.json                    # 商品マスタデモデータ（100件、code/name/unitPrice）
├── types/
│   └── index.ts                         # SelectOption<T>, Product 型定義
├── components/
│   ├── mui/
│   │   ├── MuiCodeInput.tsx             # MUI版 汎用コード入力（Autocomplete型）
│   │   ├── MuiProductCodeInput.tsx      # MUI版 商品CD入力 + 検索ダイアログ
│   │   ├── MuiProductCodeDemo.tsx       # MUI版 商品CD入力デモ画面
│   │   └── MuiOrderForm.tsx            # 発注入力フォーム（FieldCodeInput経由で使用）
│   └── antd/
│       ├── AntdCodeInput.tsx            # Antd版 汎用コード入力（AutoComplete型）
│       ├── AntdProductCodeInput.tsx     # Antd版 商品CD入力 + 検索ダイアログ
│       ├── AntdProductCodeDemo.tsx      # Antd版 商品CD入力デモ画面
│       └── AntdOrderForm.tsx           # 発注入力フォーム（FieldCodeInput経由で使用）
```

---

## メイン画面への組み込み

### タブ定義

```ts
{ key: 'code', label: 'CD入力', description: '商品コード検索、モーダル検索、エラー制御、長いエラーメッセージの表示' }
```

### タブコンテンツ

```ts
code: { mui: <MuiProductCodeDemo />, antd: <AntdProductCodeDemo /> }
```

`ComparisonRow` を使い、左にMUI版・右にAnt Design版を横並びで配置。各コンポーネントの下に `ValueDisplay` で現在の選択状態（商品コード・商品名）を表示。

### 発注入力フォームでの利用

`MuiOrderForm` / `AntdOrderForm` 内では `FieldCodeInput` ラッパー経由で `CodeInput` を使用。以下のマスタデータに対応：

- 仕入先（suppliers）
- 担当者（staffMembers）
- 納品先倉庫（warehouses）
- 発注区分（orderTypes）
- 部署（departments）
- 支払条件（paymentTerms）
- 配送方法（deliveryMethods）
- 優先度（priorities）
- 通貨（currencies）
- 承認者（staffMembers）

---

## 備考

- `CodeInput` は `SelectOption[]` を受け取る汎用コンポーネントとして、フォーム内の各種マスタ入力に再利用されている
- `ProductCodeInput` は商品マスタ専用で、検索ダイアログ（F2キー対応）を持つ
- 商品データは静的JSONから読み込み、将来的にAPI化する場合はデータ取得層のみ差し替える想定
- エラー状態は値を編集し始めた時点で解除される
- ダイアログを開いた初期状態では全件がテーブルに表示される
- IME入力（日本語入力）中はバリデーション・キーボード操作を適切に制御している
