<script lang="ts">
export let value: string = ''

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
    mode = EditMode.Read
  }
}
</script>

{#if mode === EditMode.Read}
  <span on:click={startEditing}>{#if value == ''}&nbsp;{/if}{value}</span>
{:else}
  <input type="text" bind:value use:focus on:keydown={onKeyDown} />
{/if}
