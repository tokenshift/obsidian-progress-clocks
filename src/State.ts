export default class State {
  debug = false
  sections: SectionState[]
}

export type SectionState = {
  name: string
  children: SectionChild[]
}

export type SectionChild = ClockState | CounterState | StopwatchState

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
}

export type StopwatchState = {
  type: 'stopwatch'
  name: string
  startMillis: number
  offsetMillis: number
  showMillis: boolean
  isRunning: boolean
  lapTimes: number[]
}
