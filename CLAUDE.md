# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

業務アプリケーション、および一部顧客（企業）向けWebアプリのUI構築にあたり、MUI (Material UI) と Ant Design のどちらを採用するかを判断するための比較アプリケーション。各入力コンポーネントの機能・見た目・操作感を同一画面上で横並びに比較し、ライブラリ選定の意思決定を支援する。GitHub Pages (`/WebComponentTest/`) でホスティング。

## コマンド

- `npm run dev` — 開発サーバー起動（Vite）
- `npm run build` — TypeScriptコンパイル + Viteビルド（`tsc && vite build`）
- `npm run preview` — ビルド済みアプリのプレビュー

テストフレームワークは未導入。

## アーキテクチャ

### UIライブラリの対比構造

各入力タイプ（日付、時刻、数値、テキスト、Autocomplete、テーブル）について、MUI版とAntd版の2つのコンポーネントを用意し、`ComparisonRow`で横並び表示する。

- `src/components/mui/` — MUI実装（`@mui/material`, `@mui/x-date-pickers`, `@mui/x-data-grid`）
- `src/components/antd/` — Ant Design実装（`antd`）
- `src/components/common/` — 両ライブラリ共通の再利用コンポーネント（FlexDateInputなど）

### 命名規則

コンポーネントは `Mui` / `Antd` プレフィックスで対応関係を明示：
- `MuiDateInput.tsx` ↔ `AntdDateInput.tsx`
- `MuiProductCodeDemo.tsx` ↔ `AntdProductCodeDemo.tsx`

### テーマ連動

`App.tsx`でMUI (`createTheme`) と Antd (`ConfigProvider`) のテーマを同一のUI設定（プライマリカラー、角丸、フォントサイズ、コントロール高さ）から同時生成し、サイドバーのスライダーでリアルタイム調整可能。

### 共有型定義

`src/types/index.ts` — `SelectOption`, `FieldState`, `FormValues`, `Product` など、両ライブラリ共通の型を集約。

### カスタムフック・ユーティリティ

- `src/hooks/useFlexDateInput.ts` — 柔軟な日付入力（テキスト直接入力 + ピッカー）のロジック
- `src/utils/parseDateInput.ts` — 日付文字列のパース処理

### データ

- `src/data/sampleData.ts` — セレクト・オートコンプリート用サンプルデータ
- `src/data/tableData.ts` — テーブル用サンプルデータ
- `src/data/products.json` — 商品コードデータ

## 技術スタック

- React 19 + TypeScript (strict mode)
- Vite 7 + `@vitejs/plugin-react`
- dayjs（日本語ロケール `ja`）
- `react-number-format` — 数値フォーマット入力
