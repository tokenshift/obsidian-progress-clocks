<script lang="ts">
import { createEventDispatcher } from 'svelte'

import State from '../State'
import Section from './Section.svelte'

const dispatch = createEventDispatcher()

export let state = new State()
export let version: string
export let showTitle = false

$: dispatch('stateUpdated', { state })

function addSection() {
  state.sections.push({ name: `Section ${state.sections.length + 1}`, children: [] })
  state.sections = state.sections
}

function removeSection(i: number) {
  state.sections.splice(i, 1)
  state.sections = state.sections
}
</script>

{#if showTitle}
<header class="counters-title">
  <span class="counters-title__main-title">Counters</span>
  <a class="counters-title__subtitle" href="https://github.com/tokenshift/obsidian-counters">https://github.com/tokenshift/obsidian-counters</a>
</header>
{/if}

<div class="counters-panel">
  {#each state.sections as section, i}
    <Section bind:name={section.name} bind:children={section.children} on:removeSection={() => removeSection(i)} />
  {/each}
  <a href="javascript:;" class="counters-panel__add-section" on:click={addSection}>Add Section</a>
  {#if version}
  <span class="counters-version">Counters v{version}</span>
  {/if}
</div>

{#if state.debug}
<pre class="counters-debug">
{JSON.stringify(state, null, 2)}
</pre>
{/if}

