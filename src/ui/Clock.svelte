<script type="ts">
import { MinusSquare, PlusSquare } from 'lucide-svelte'

import { clickable } from './util'

export let segments: number = 4
export let filled: number = 0

$: fillCircle = segments <= 1 ? filled >= 1 : null

const radius = 50
const padding = 4

function slices(segments: number, filled: number) {
  const ss = []

  for (let i = 0; i < segments; ++i) {
    const x1 = radius * Math.sin((2 * Math.PI * i) / segments) + radius + padding
    const x2 = radius * Math.sin((2 * Math.PI * (i + 1)) / segments) + radius + padding

    const y1 = -radius * Math.cos((2 * Math.PI * i) / segments) + radius + padding
    const y2 = -radius * Math.cos((2 * Math.PI * (i + 1)) / segments) + radius + padding

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

function onKeyDown (e: KeyboardEvent) {
  if (['Enter', ' '].contains(e.key)) {
    e.ctrlKey ? decrement() : increment()
  } else if (['ArrowUp', 'ArrowRight'].contains(e.key)) {
    if (e.ctrlKey) {
      segments = segments + 1
    } else {
      increment()
    }
  } else if (['ArrowDown', 'ArrowLeft'].contains(e.key)) {
    if (e.ctrlKey) {
      segments = Math.max(1, segments -1)
    } else {
      decrement()
    }
  }
}
</script>

<div class="progress-clocks-clock">
  <svg
    data-segments={segments}
    data-filled={filled}
    role="button"
    tabindex="0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 {2*radius + 2*padding} {2*radius + 2*padding}"
    on:click={increment}
    on:contextmenu={decrement}
    on:keydown={onKeyDown}>
    {#if segments > 1}
      {#each slices(segments, filled) as { x1, x2, y1, y2, isFilled }, i}
        <path
          data-segment={i}
          data-filled={isFilled}
          d="
        M {radius+padding} {radius+padding}
        L {x1} {y1}
        A {radius} {radius} 0 0 1 {x2} {y2}
        Z" />
      {/each}
    {/if}
    <circle cx={radius+padding} cy={radius+padding} r={radius} data-filled={fillCircle} />
  </svg>
  <div class="progress-clocks-clock__buttons">
    <div
      role="button"
      tabindex="0"
      class="progress-clocks-button progress-clocks-clock__decrement"
      on:click={decrement}
      on:keydown={clickable(decrement)}>
      <MinusSquare />
    </div>
    <div
      role="button"
      tabindex="0"
      class="progress-clocks-button progress-clocks-clock__increment"
      on:click={increment}
      on:keydown={clickable(increment)}>
      <PlusSquare />
    </div>
  </div>
</div>
