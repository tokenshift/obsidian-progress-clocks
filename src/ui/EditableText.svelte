<script lang="ts" context="module">
export enum EditMode {
  Read,
  Edit
}

</script>

<script lang="ts">
import { createEventDispatcher, tick } from 'svelte'
import { ifClickEquivalent } from './util'

const dispatch = createEventDispatcher()

export let value: string = ''
let newValue = value
let focusTarget: HTMLElement

export let mode = EditMode.Read
$: dispatch('modeChanged', { mode })

function startEditing() {
  mode = EditMode.Edit
}

function takeFocus(el: HTMLInputElement) {
  el.focus()
  el.select()
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    value = newValue = newValue.trim()
    mode = EditMode.Read
    dispatch('confirmed', { value })
  } else if (e.key === 'Escape') {
    newValue = value
    mode = EditMode.Read
    dispatch('cancelled', { value })
  }

  tick().then(() => focusTarget?.focus())
}
</script>

{#if mode === EditMode.Read}
  <span
    role="button"
    tabindex="0"
    bind:this={focusTarget}
    on:click={startEditing}
    on:keydown={ifClickEquivalent(startEditing)}>
    {#if value == ''}&nbsp;{/if}
    {value}
  </span>
{:else}
  <input type="text" bind:value={newValue} use:takeFocus on:keydown={onKeyDown} />
{/if}
