<script lang="ts" context="module">
export enum EditMode {
  Read,
  Edit
}
</script>

<script lang="ts">
import { createEventDispatcher } from 'svelte'

export let value: number = 0

let newValue = value.toString()

export let mode: EditMode = EditMode.Read

const dispatch = createEventDispatcher()
$: dispatch('modeChanged', { mode })

function startEditing() {
  if (!newValue.startsWith('+') && !newValue.startsWith('-')) {
    newValue = value.toString()
  }

  mode = EditMode.Edit
}

function focus(el: HTMLInputElement) {
  el.focus()
  el.select()
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    newValue = newValue.trim()

    if (newValue.startsWith('+') || newValue.startsWith('-')) {
      // TODO: Support simple math, not just leading +/-
      value += Number(newValue)
    } else {
      value = Number(newValue)
    }

    mode = EditMode.Read
  } else if (e.key === 'Escape') {
    mode = EditMode.Read
  }
}
</script>

{#if mode === EditMode.Read}
  <span on:click={startEditing}>{value}</span>
{:else}
  <input type="text" bind:value={newValue} use:focus on:keydown={onKeyDown} />
{/if}
