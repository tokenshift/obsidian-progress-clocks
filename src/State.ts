export default class State {
  debug = false
  sections: SectionState[]
}

export type SectionState = {
  name: string
  children: SectionChild[]
}

export type SectionChild = ClockState | CounterState | TimerState

export type ClockState = {
  type: 'clock'
  name: string
  segments: number
  filled: number
}

export type CounterState = {
  type: 'counter'
  name: string
  value: number
  min?: number
  max?: number
}

export type TimerState = {
  type: 'timer'
  name: string
  startMillis: number
  offsetMillis: number
  showMillis: boolean
  isRunning: boolean
}
