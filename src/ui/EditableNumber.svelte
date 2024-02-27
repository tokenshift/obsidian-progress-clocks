<script lang="ts" context="module">
export enum EditMode {
  Read,
  Edit
}
</script>

<script lang="ts">
import { createEventDispatcher, tick } from 'svelte'

const dispatch = createEventDispatcher()

export let value: number = 0
let newValue = value.toString()
let focusTarget: HTMLElement

export let mode: EditMode = EditMode.Read
$: dispatch('modeChanged', { mode })

function startEditing() {
  if (!newValue.startsWith('+') && !newValue.startsWith('-')) {
    newValue = value.toString()
  }

  mode = EditMode.Edit
}

function takeFocus(el: HTMLInputElement) {
  el.focus()
  el.select()
}

function onEditKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    newValue = newValue.trim()

    if (newValue.startsWith('+') || newValue.startsWith('-')) {
      // TODO: Support simple math, not just leading +/-
      value += Number(newValue)
    } else {
      value = Number(newValue)
    }

    mode = EditMode.Read
    dispatch('confirmed', { value })
  } else if (e.key === 'Escape') {
    mode = EditMode.Read
    dispatch('cancelled', { value })
  }

  tick().then(() => focusTarget?.focus())
}

function onSpanKeyDown(e: KeyboardEvent) {
  if (['Enter', ' '].contains(e.key)) {
    startEditing()
    e.preventDefault()
  } else if (['ArrowUp', 'ArrowRight'].contains(e.key)) {
    value += 1
    e.preventDefault()
  } else if (['ArrowDown', 'ArrowLeft'].contains(e.key)) {
    value -= 1
    e.preventDefault()
  }
}
</script>

{#if mode === EditMode.Read}
  <span
    role="button"
    tabindex="0"
    bind:this={focusTarget}
    on:click|preventDefault={startEditing}
    on:keydown={onSpanKeyDown}>
    {value}
  </span>
{:else}
  <input type="text" bind:value={newValue} use:takeFocus on:keydown={onEditKeyDown} />
{/if}
