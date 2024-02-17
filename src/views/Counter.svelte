<script lang="ts" context="module">
import EditableNumber from './EditableNumber.svelte'

export type CounterParams = {
  type: 'counter'
  name?: string
  value?: number
  step?: number
  min?: number | null
  max?: number | null
}
</script>

<script lang="ts">
export let value = 0
export let step = 1

export let min: number | null = null
export let max: number | null = null

export function increment() {
  value = max === null ? value + step : Math.min(max, value + step)
}

export function decrement() {
  value = min === null ? value - step : Math.max(min, value - step)
}

$: isMin = min !== null && value <= min
$: isMax = max !== null && value >= max

$: value = max === null ? value + step : Math.min(max, value + step)
$: value = min === null ? value - step : Math.max(min, value - step)
</script>

<div class="counters-counter">
  <div class="counters-counter__value">
    <EditableNumber bind:value />
  </div>
  <div class="counters-counter__buttons">
    <button class="counters-counter__button-increment" on:click={() => (value += 1)} disabled={isMax}>+</button>
    <button class="counters-counter__button-decrement" on:click={() => (value -= 1)}>-</button>
  </div>
</div>
