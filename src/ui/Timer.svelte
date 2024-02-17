<script lang="ts">
import { onDestroy, onMount } from 'svelte'

const locale = Intl.NumberFormat().resolvedOptions().locale

export let name: string = 'Clock'
export let startMillis: number = new Date().getTime()
export let offsetMillis: number = 0
export let showMillis: boolean = false
export let isRunning: boolean = true

const TICK_INTERVAL_MS = 10

let elapsed = 0

function tick() {
  elapsed = new Date().getTime() - startMillis + offsetMillis
}

onMount(() => {
  if (isRunning) {
    tick()
    start()
  } else {
    elapsed = offsetMillis
  }
})

onDestroy(() => {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }
})

$: seconds = showMillis ? (elapsed / 1000) % 60 : Math.floor(elapsed / 1000) % 60
$: secondsFormatted = Intl.NumberFormat(locale, {
  style: 'decimal',
  minimumIntegerDigits: 2,
  minimumFractionDigits: showMillis ? 3 : 0
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

let tickInterval: NodeJS.Timer | null = null

export function start() {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }

  offsetMillis = elapsed
  startMillis = new Date().getTime()
  tickInterval = setInterval(tick, TICK_INTERVAL_MS)
  isRunning = true
}

export function stop() {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }

  offsetMillis = elapsed
  isRunning = false
}

export function reset() {
  startMillis = new Date().getTime()
  offsetMillis = 0
  elapsed = 0
}

export function togglePrecision() {
  showMillis = !showMillis
}

// onMount(start)

// onDestroy(stop)
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
