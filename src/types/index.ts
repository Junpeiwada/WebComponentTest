import type { Dayjs } from 'dayjs'

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

export interface FieldState<T = unknown> {
  display: string
  value: T
}

export interface FormValues {
  date: FieldState<string | null>
  dateTime: FieldState<string | null>
  time: FieldState<string | null>
  number: FieldState<number | null>
  text: FieldState<string>
  autocomplete: FieldState<number | string | null>
  select: FieldState<number | string | null>
}

export interface InputChangeHandler<T = unknown> {
  (display: string, value: T): void
}

export type DateChangeHandler = (display: string, value: string | null, dayjsValue: Dayjs | null) => void

export interface Product {
  code: number
  name: string
  unitPrice: number
}
