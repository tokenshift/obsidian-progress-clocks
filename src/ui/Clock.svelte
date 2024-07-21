<script type="ts">
import { createEventDispatcher, onDestroy } from 'svelte'
import { ArrowUpFromLine, ArrowDownFromLine, MinusSquare, PlusSquare } from 'lucide-svelte'
import { ifClickEquivalent } from './util'

export let segments: number = 4
export let filled: number = 0

onDestroy(console.log('destroyed from:', new Error().stack))

const dispatch = createEventDispatcher()

$: dispatch('updated', { segments, filled })

$: fillCircle = segments <= 1 ? filled >= 1 : null
$: segments = Math.max(1, segments)
$: filled = filled < 0 ? segments : filled
$: filled = filled > segments ? 0 : filled

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

function handleIncrement(e: MouseEvent | KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) {
    segments += 1
  } else {
    filled += 1
  }
}

function handleDecrement(e: MouseEvent | KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) {
    segments -= 1
    filled = Math.min(segments, filled)
  } else {
    filled -= 1
  }
}

function handleClockKeyInteraction(e: KeyboardEvent) {
  if (['Enter', ' ', 'ArrowUp', 'ArrowRight'].contains(e.key)) {
    if (e.ctrlKey || e.metaKey) {
      segments += 1
    } else {
      filled += 1
    }

    e.preventDefault()
  } else if (['ArrowDown', 'ArrowLeft'].contains(e.key)) {
    if (e.ctrlKey || e.metaKey) {
      segments -= 1
      filled = Math.min(segments, filled)
    } else {
      filled -= 1
    }

    e.preventDefault()
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
    viewBox="0 0 {2 * radius + 2 * padding} {2 * radius + 2 * padding}"
    on:click|preventDefault={handleIncrement}
    on:contextmenu|preventDefault={handleDecrement}
    on:keydown={handleClockKeyInteraction}>
    {#if segments > 1}
      {#each slices(segments, filled) as { x1, x2, y1, y2, isFilled }, i}
        <path
          data-segment={i}
          data-filled={isFilled}
          d="
        M {radius + padding} {radius + padding}
        L {x1} {y1}
        A {radius} {radius} 0 0 1 {x2} {y2}
        Z" />
      {/each}
    {/if}
    <circle cx={radius + padding} cy={radius + padding} r={radius} data-filled={fillCircle} />
  </svg>
  <div class="progress-clocks-clock__buttons">
    <button
      class="progress-clocks-clock__decrement"
      title="Unfill one segment"
      on:click|preventDefault={handleDecrement}
      on:keydown={ifClickEquivalent(handleDecrement)}>
      <MinusSquare />
    </button>
    <button
      class="progress-clocks-clock__increment"
      title="Fill one segment"
      on:click|preventDefault={handleIncrement}
      on:keydown={ifClickEquivalent(handleIncrement)}>
      <PlusSquare />
    </button>
    <button
      class="progress-clocks-clock__decrement-segments"
      title="Remove one segment"
      on:click|preventDefault={() => (segments -= 1)}
      on:keydown={ifClickEquivalent(() => (segments -= 1))}>
      <ArrowDownFromLine />
    </button>
    <button
      class="progress-clocks-clock__increment-segments"
      title="Add another segment"
      on:click|preventDefault={() => (segments += 1)}
      on:keydown={ifClickEquivalent(() => (segments += 1))}>
      <ArrowUpFromLine />
    </button>
  </div>
</div>
