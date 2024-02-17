<script lang="ts">
  import { writable } from 'svelte/store'

  export const numerator = writable<number>(0)
  export const denominator = writable<number>(4)
</script>

<svg
  class="counter"
  xmlns="http://www.w3.org/2000/svg"
  height="100"
  width="100"
  viewBox="0 0 100 100">
</svg>