<script lang="ts">
import { createEventDispatcher, onDestroy, onMount } from 'svelte'
import { Pause, Play, RefreshCcw, Timer } from 'lucide-svelte'
import { ifClickEquivalent } from './util'

const dispatch = createEventDispatcher()
const locale = Intl.NumberFormat().resolvedOptions().locale

export let startMillis: number = new Date().getTime()
export let offsetMillis: number = 0
export let showMillis: boolean = false
export let isRunning: boolean = true
export let lapTimes: number[] = []

const TICK_INTERVAL_MS = 10

let elapsedMs = 0
let tickInterval: NodeJS.Timer | null = null

function tick() {
  elapsedMs = new Date().getTime() - startMillis + offsetMillis
}

onMount(() => {
  if (isRunning) {
    tick()
    start()
  } else {
    elapsedMs = offsetMillis
  }
})

onDestroy(() => {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }
})

export function start() {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }

  offsetMillis = elapsedMs
  startMillis = new Date().getTime()
  tickInterval = setInterval(tick, TICK_INTERVAL_MS)
  isRunning = true
}

export function stop() {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }

  offsetMillis = elapsedMs
  isRunning = false
}

export function reset() {
  startMillis = new Date().getTime()
  offsetMillis = 0
  lapTimes = []
  elapsedMs = 0
}

export function togglePrecision() {
  showMillis = !showMillis
}

export function lap() {
  lapTimes.push(elapsedMs)
  lapTimes = lapTimes
  dispatch('lap', { elapsedMs })
}

function formatTime (ms: number, showMillis: boolean = false) {
  const seconds = showMillis ? (ms / 1000) % 60 : Math.floor(ms / 1000) % 60
  const secondsFormatted = Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumIntegerDigits: 2,
    minimumFractionDigits: showMillis ? 3 : 0
  }).format(seconds)

  const minutes = Math.floor(ms / 1000 / 60) % 60
  const minutesFormatted = Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumIntegerDigits: 2
  }).format(minutes)

  const hours = Math.floor(ms / 1000 / 60 / 60)
  const hoursFormatted = Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumIntegerDigits: 2
  }).format(hours)

  return hours > 0
    ? `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`
    : `${minutesFormatted}:${secondsFormatted}`
}
</script>

<div class="progress-clocks-stopwatch">
  <div
    class="progress-clocks-stopwatch__elapsed"
    role="button"
    tabindex="0"
    on:click={togglePrecision}
    on:keydown={ifClickEquivalent(togglePrecision)}>
    {formatTime(elapsedMs, showMillis)}
  </div>
  <div class="progress-clocks-stopwatch__buttons">
    <button on:click={() => isRunning ? stop() : start()}>
      {#if isRunning}
        <Pause />
      {:else}
        <Play />
      {/if}
    </button>
    <button on:click={reset}>
      <RefreshCcw />
    </button>
    <button on:click={lap}>
      <Timer />
    </button>
    <button on:click={() => showMillis = !showMillis}>
      /1000
    </button>
  </div>
  {#if lapTimes.length > 0}
    <div class="progress-clocks-stopwatch__laps">
      {#each lapTimes as lapTime, i}
        <div data-lap-time-ms={lapTime}>({i+1}) {formatTime(lapTime, showMillis)}</div>
      {/each}
    </div>
  {/if}
</div>
