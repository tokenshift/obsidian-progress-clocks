<script lang="ts">
import { MinusSquare, PlusSquare } from 'lucide-svelte'

import EditableNumber from './EditableNumber.svelte'
import { clickable } from './util'

export let value = 0

export function increment() {
  value += 1
}

export function decrement() {
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
      on:click={decrement}
      on:keydown={clickable(decrement)}>
      <MinusSquare />
    </div>
    <div
      role="button"
      tabindex="0"
      class="progress-clocks-button progress-clocks-counter__increment"
      on:click={increment}
      on:keydown={clickable(increment)}>
      <PlusSquare />
    </div>
  </div>
</div>
