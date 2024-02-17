<script lang="ts">
import { createEventDispatcher } from 'svelte'
import { fade } from 'svelte/transition'

import EditableText from './EditableText.svelte'
import Clock from './Clock.svelte'
import Counter from './Counter.svelte'
import Timer from './Timer.svelte'

import type { SectionChild } from 'src/State'

export let name: string
export let children: SectionChild[]

// TODO: Add a way to remove specific children
// TODO: Add a way to name specific children

const dispatch = createEventDispatcher()

function raiseRemoveSection() {
  dispatch('removeSection', { self: this })
}

function addClock() {
  // TODO: Ask for number of segments
  children.push({
    type: 'clock',
    name: `Clock ${children.length + 1}`,
    segments: 4,
    filled: 0
  })

  children = children
}

function addCounter() {
  children.push({
    type: 'counter',
    name: `Counter ${children.length + 1}`,
    value: 0
  })

  children = children
}

function addTimer() {
  children.push({
    type: 'timer',
    name: `Timer ${children.length + 1}`,
    startMillis: new Date().getTime(),
    offsetMillis: 0,
    showMillis: false,
    isRunning: true
  })

  children = children
}
</script>

<section class="counters-section" transition:fade={{ duration: 100 }}>
  <div class="counters-section__name">
    <EditableText bind:value={name} />
  </div>
  <a href="javscript:;" class="counters-section__remove" on:click|preventDefault={raiseRemoveSection}>❌</a>
  <div class="counters-section__slot">
    {#each children as child}
      {#if child.type === 'clock'}
        <Clock {...child}
          bind:name={child.name}
          bind:segments={child.segments}
          bind:filled={child.filled} />
      {:else if child.type === 'counter'}
        <Counter {...child}
          bind:name={child.name}
          bind:value={child.value} />
      {:else if child.type === 'timer'}
        <Timer {...child}
          bind:name={child.name}
          bind:startMillis={child.startMillis}
          bind:offsetMillis={child.offsetMillis}
          bind:showMillis={child.showMillis}
          bind:isRunning={child.isRunning} />
      {/if}
    {/each}
  </div>
  <div class="counters-section__add-child">
    Add:
    <button class="counters-section__add-clock" on:click|preventDefault={addClock}>🕒</button>
    <button class="counters-section__add-counter" on:click|preventDefault={addCounter}>#️</button>
    <button class="counters-section__add-timer" on:click|preventDefault={addTimer}>⏳</button>
  </div>
</section>
