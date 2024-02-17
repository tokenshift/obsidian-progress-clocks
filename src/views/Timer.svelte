<script lang="ts" context="module">
export type TimerParams = {
  type: 'timer'
  name?: string
  showMilliseconds?: boolean
  elapsed?: number
}
</script>

<script lang="ts">
import moment from 'moment'
import { onDestroy, onMount } from 'svelte'

const locale = Intl.NumberFormat().resolvedOptions().locale

export let showMilliseconds = false

let startTime = moment()
let offset = 0

export let elapsed = 0

$: seconds = showMilliseconds ? (elapsed / 1000) % 60 : Math.floor(elapsed / 1000) % 60
$: secondsFormatted = Intl.NumberFormat(locale, {
  style: 'decimal',
  minimumIntegerDigits: 2,
  minimumFractionDigits: showMilliseconds ? 3 : 0
}).format(seconds)

$: minutes = Math.floor(elapsed / 1000 / 60) % 60
$: minutesFormatted = Intl.NumberFormat(locale, {
  style: 'decimal',
  minimumIntegerDigits: 2
}).format(minutes)

$: hours = Math.floor(elapsed / 1000 / 60 / 60)
$: hoursFormatted = Intl.NumberFormat(locale, {
  style: 'decimal',
  minimumIntegerDigits: 2
}).format(hours)

let interval: NodeJS.Timer | null = null
$: isRunning = interval !== null

function update() {
  elapsed = moment().diff(startTime) + offset
}

export function start() {
  stop()
  offset = elapsed
  startTime = moment()
  interval = setInterval(update, 10)
}

export function stop() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

export function reset() {
  startTime = moment()
  offset = 0
  elapsed = 0
}

export function togglePrecision() {
  showMilliseconds = !showMilliseconds
}

onMount(start)

onDestroy(stop)
</script>

<div class="counters-timer">
  <span class="counters-timer__elapsed" on:click={togglePrecision}>
    {#if hours > 0}{hoursFormatted}:{/if}{minutesFormatted}:{secondsFormatted}
  </span>
  <div class="counters-timer__buttons">
    {#if isRunning}
      <button on:click={stop}>⏸️</button>
    {:else}
      <button on:click={start}>▶️</button>
    {/if}
    <button on:click={reset}>🔁</button>
  </div>
</div>
