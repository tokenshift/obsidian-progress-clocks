<script lang="ts">
import { MinusSquare, PlusSquare } from 'lucide-svelte'

import EditableNumber from './EditableNumber.svelte'
import { ifClickEquivalent } from './util'

export let value = 0

export function increment(e: MouseEvent | KeyboardEvent) {
  value += 1
}

export function decrement(e: MouseEvent | KeyboardEvent) {
  value -= 1
}
</script>

<div class="progress-clocks-counter">
  <div class="progress-clocks-counter__value">
    <EditableNumber bind:value />
  </div>
  <div class="progress-clocks-counter__buttons">
    <div
      role="button"
      tabindex="0"
      class="progress-clocks-button progress-clocks-counter__decrement"
      on:click|preventDefault={decrement}
      on:keydown={ifClickEquivalent(decrement)}>
      <MinusSquare />
    </div>
    <div
      role="button"
      tabindex="0"
      class="progress-clocks-button progress-clocks-counter__increment"
      on:click|preventDefault={increment}
      on:keydown={ifClickEquivalent(increment)}>
      <PlusSquare />
    </div>
  </div>
</div>
