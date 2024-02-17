<script type="ts" context="module">
export type ClockParams = {
  type: 'clock'
  name?: string
  segments?: number
  filled?: number
}
</script>

<script type="ts">
import EditableText from './EditableText.svelte'

export let name: string = 'Clock'
export let segments: number = 4
export let filled: number = 0

// TODO: Add a way to add/remove segments

const radius = 50

function slices(segments: number, filled: number) {
  const ss = []

  for (let i = 0; i < segments; ++i) {
    const x1 = radius * Math.sin((2 * Math.PI * i) / segments) + radius
    const x2 = radius * Math.sin((2 * Math.PI * (i + 1)) / segments) + radius

    const y1 = -radius * Math.cos((2 * Math.PI * i) / segments) + radius
    const y2 = -radius * Math.cos((2 * Math.PI * (i + 1)) / segments) + radius

    ss.push({
      x1,
      x2,
      y1,
      y2,
      isFilled: i < filled
    })
  }

  return ss
}

function increment() {
  filled += 1
  if (filled > segments) {
    filled = 0
  }
}

function decrement() {
  filled -= 1
  if (filled < 0) {
    filled = segments
  }
}
</script>

<div class="counters-clock">
  <svg
    data-counters-segments={segments}
    data-counters-filled={filled}
    xmlns="http://www.w3.org/2000/svg"
    viewbox="0 0 {2 * radius} {2 * radius}"
    on:click|preventDefault={increment}
    on:contextmenu|preventDefault={decrement}>
    {#each slices(segments, filled) as { x1, x2, y1, y2, isFilled }, i}
      <path
        data-segment={i}
        data-filled={isFilled}
        d="
      M {radius} {radius}
      L {x1} {y1}
      A {radius} {radius} 0 0 1 {x2} {y2}
      Z" />
    {/each}
    <circle cx={radius} cy={radius} r={radius} />
  </svg>
  <div class="counters-clock__name">
    <EditableText bind:value={name} />
  </div>
</div>
