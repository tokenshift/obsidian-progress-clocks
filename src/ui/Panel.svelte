<script lang="ts">
import { createEventDispatcher } from 'svelte'

import State from '../State'
import Section from './Section.svelte'
import { ifClickEquivalent } from './util'

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

<div class="progress-clocks progress-clocks-panel">
  {#if showTitle}
    <header class="progress-clocks-title">
      <span class="progress-clocks-title__main-title">Progress Clocks</span>
      <a class="progress-clocks-title__subtitle" href="https://github.com/tokenshift/obsidian-progress-clocks">
        https://github.com/tokenshift/obsidian-progress-clocks
      </a>
    </header>
  {/if}

  {#each state.sections as section, i}
    <Section bind:name={section.name} bind:children={section.children} on:removeSection={() => removeSection(i)} />
  {/each}

  <div
    class="progress-clocks-button progress-clocks-panel__add-section"
    role="button"
    tabindex="0"
    on:keydown={ifClickEquivalent(addSection)}
    on:click={addSection}>
    Add Section
  </div>

  {#if state.debug}
    <pre class="progress-clocks-debug">
  {JSON.stringify(state, null, 2)}
  </pre>
  {/if}

  {#if version}
    <div class="progress-clocks-panel__version">Counters v{version}</div>
  {/if}
</div>
