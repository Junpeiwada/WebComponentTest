import { useState, useMemo } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { ConfigProvider } from 'antd'
import jaJP from 'antd/locale/ja_JP'
import 'dayjs/locale/ja'

import { ComparisonRow } from './components/ComparisonRow'

import { MuiDateInput } from './components/mui/MuiDateInput'
import { MuiTimeInput } from './components/mui/MuiTimeInput'
import { MuiNumberInput } from './components/mui/MuiNumberInput'
import { MuiTextInput } from './components/mui/MuiTextInput'
import { MuiAutocomplete } from './components/mui/MuiAutocomplete'
import { MuiTable } from './components/mui/MuiTable'

import { AntdDateInput } from './components/antd/AntdDateInput'
import { AntdTimeInput } from './components/antd/AntdTimeInput'
import { AntdNumberInput } from './components/antd/AntdNumberInput'
import { AntdTextInput } from './components/antd/AntdTextInput'
import { AntdAutocomplete } from './components/antd/AntdAutocomplete'
import { AntdTable } from './components/antd/AntdTable'

const DRAWER_WIDTH = 220

const tabs = [
  { key: 'date', label: '日付入力', description: 'カレンダーの有無、フォーマット、範囲制限などのバリエーション' },
  { key: 'time', label: '時刻入力', description: '24時間制/12時間制、ステップ指定、ピッカーの有無' },
  { key: 'number', label: '数値入力', description: 'カンマ区切り、小数点、パーセント、通貨、範囲制限、ステッパー' },
  { key: 'text', label: '文字列入力', description: '基本テキスト、文字数制限、パスワード、TextArea、prefix/suffix、エラー表示' },
  { key: 'autocomplete', label: 'Autocomplete', description: 'label/valueマッピング、freeSolo、複数選択、グループ化、非同期読み込み' },
  { key: 'table', label: 'テーブル', description: 'ソート、フィルタ、ページネーション、行選択、カスタムレンダー' },
] as const

type TabKey = (typeof tabs)[number]['key']

const tabContent: Record<TabKey, { mui: React.ReactNode; antd: React.ReactNode }> = {
  date: { mui: <MuiDateInput />, antd: <AntdDateInput /> },
  time: { mui: <MuiTimeInput />, antd: <AntdTimeInput /> },
  number: { mui: <MuiNumberInput />, antd: <AntdNumberInput /> },
  text: { mui: <MuiTextInput />, antd: <AntdTextInput /> },
  autocomplete: { mui: <MuiAutocomplete />, antd: <AntdAutocomplete /> },
  table: { mui: <MuiTable />, antd: <AntdTable /> },
}

interface ThemeSettings {
  primaryColor: string
  borderRadius: number
  fontSize: number
  controlHeight: number
}

const defaultSettings: ThemeSettings = {
  primaryColor: '#1677ff',
  borderRadius: 6,
  fontSize: 14,
  controlHeight: 32,
}

const sliderItems: { key: keyof ThemeSettings; label: string; min: number; max: number; unit: string }[] = [
  { key: 'borderRadius', label: '角丸', min: 0, max: 20, unit: 'px' },
  { key: 'fontSize', label: 'フォント', min: 10, max: 18, unit: 'px' },
  { key: 'controlHeight', label: '高さ', min: 24, max: 44, unit: 'px' },
]

type LibTab = 'mui' | 'antd'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('date')
  const [libTab, setLibTab] = useState<LibTab>('mui')
  const [settings, setSettings] = useState<ThemeSettings>({ ...defaultSettings })
  const current = tabs.find((t) => t.key === activeTab)!

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: { primary: { main: settings.primaryColor } },
        shape: { borderRadius: settings.borderRadius },
        typography: { fontSize: settings.fontSize },
        components: {
          MuiInputBase: {
            styleOverrides: {
              root: { fontSize: `${settings.fontSize}px` },
              input: { fontSize: `${settings.fontSize}px` },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: { borderRadius: settings.borderRadius },
              sizeSmall: { height: settings.controlHeight },
            },
          },
          MuiFormLabel: {
            styleOverrides: {
              root: { fontSize: settings.fontSize },
            },
          },
        },
      }),
    [settings]
  )

  const antdTheme = useMemo(
    () => ({
      token: {
        colorPrimary: settings.primaryColor,
        borderRadius: settings.borderRadius,
        fontSize: settings.fontSize,
        controlHeight: settings.controlHeight,
      },
    }),
    [settings]
  )

  const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const isDefault =
    settings.primaryColor === defaultSettings.primaryColor &&
    settings.borderRadius === defaultSettings.borderRadius &&
    settings.fontSize === defaultSettings.fontSize &&
    settings.controlHeight === defaultSettings.controlHeight

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
        <ConfigProvider locale={jaJP} theme={antdTheme}>
          <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* AppBar */}
            <AppBar
              position="fixed"
              elevation={0}
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Toolbar variant="dense">
                <Typography variant="h6" sx={{ color: 'text.primary', fontSize: 18, fontWeight: 600 }}>
                  UI 入力コンポーネント比較 — MUI vs Ant Design
                </Typography>
              </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
              variant="permanent"
              sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: DRAWER_WIDTH,
                  boxSizing: 'border-box',
                },
              }}
            >
              <Toolbar variant="dense" />
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}>
                <List disablePadding sx={{ flex: 1 }}>
                  {tabs.map((tab) => (
                    <ListItemButton
                      key={tab.key}
                      selected={activeTab === tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      sx={{
                        borderLeft: 3,
                        borderColor: activeTab === tab.key ? 'primary.main' : 'transparent',
                        py: 1.2,
                      }}
                    >
                      <ListItemText
                        primary={tab.label}
                        primaryTypographyProps={{ fontSize: 14 }}
                      />
                    </ListItemButton>
                  ))}
                </List>

                <Divider />

                {/* テーマ調整 */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography
                    variant="overline"
                    sx={{ color: 'text.secondary', letterSpacing: 1, mb: 1, display: 'block' }}
                  >
                    Theme
                  </Typography>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      プライマリカラー
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <input
                        type="color"
                        title="プライマリカラー"
                        value={settings.primaryColor}
                        onChange={(e) => updateSetting('primaryColor', e.target.value)}
                        style={{ width: 32, height: 24, border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', padding: 0 }}
                      />
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.disabled' }}>
                        {settings.primaryColor}
                      </Typography>
                    </Box>
                  </Box>

                  {sliderItems.map((item) => (
                    <Box key={item.key} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.disabled' }}>
                          {settings[item.key]}{item.unit}
                        </Typography>
                      </Box>
                      <Slider
                        size="small"
                        min={item.min}
                        max={item.max}
                        value={settings[item.key] as number}
                        onChange={(_e, v) => updateSetting(item.key, v as number)}
                      />
                    </Box>
                  ))}

                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    disabled={isDefault}
                    onClick={() => setSettings({ ...defaultSettings })}
                    sx={{ textTransform: 'none', fontSize: 12 }}
                  >
                    リセット
                  </Button>
                </Box>
              </Box>
            </Drawer>

            {/* メインコンテンツ */}
            <Box
              component="main"
              sx={{ flex: 1, overflow: 'auto', p: 3, mt: '48px' }}
            >
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: 20,
                    borderBottom: 2,
                    borderColor: 'primary.main',
                    pb: 1,
                    display: 'inline-block',
                  }}
                >
                  {current.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {current.description}
                </Typography>
              </Box>

              {activeTab === 'table' ? (
                <>
                  <Tabs
                    value={libTab}
                    onChange={(_e, v: LibTab) => setLibTab(v)}
                    sx={{ mb: 2.5, minHeight: 36 }}
                  >
                    <Tab label="MUI (Material UI)" value="mui" sx={{ textTransform: 'none', minHeight: 36, py: 0 }} />
                    <Tab label="Ant Design" value="antd" sx={{ textTransform: 'none', minHeight: 36, py: 0 }} />
                  </Tabs>
                  <Paper variant="outlined" sx={{ p: 2.5 }}>
                    {libTab === 'mui'
                      ? tabContent[activeTab].mui
                      : tabContent[activeTab].antd}
                  </Paper>
                </>
              ) : (
                <ComparisonRow
                  muiContent={tabContent[activeTab].mui}
                  antdContent={tabContent[activeTab].antd}
                />
              )}
            </Box>
          </Box>
        </ConfigProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
