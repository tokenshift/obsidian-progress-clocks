<script lang="ts">
export let value: number = 0
let newValue = value.toString()

enum EditMode {
  Read,
  Edit
}

export let mode = EditMode.Read

function startEditing(el: HTMLElement) {
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
  }
}
</script>

{#if mode === EditMode.Read}
  <span on:click={startEditing}>{value}</span>
{:else}
  <input type="text" bind:value={newValue} use:focus on:keydown={onKeyDown} />
{/if}
