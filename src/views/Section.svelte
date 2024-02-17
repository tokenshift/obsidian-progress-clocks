<script lang="ts">
import { createEventDispatcher } from 'svelte'
import { fade } from 'svelte/transition'

import EditableText from './EditableText.svelte'
import Clock from './Clock.svelte'
import type { ClockParams } from './Clock.svelte'
import Counter from './Counter.svelte'
import type { CounterParams } from './Counter.svelte'
import Timer from './Timer.svelte'
import type { TimerParams } from './Timer.svelte'

export let name: string

export let children: (ClockParams | CounterParams | TimerParams)[]

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
    name: `Counter ${children.length + 1}`
  })

  children = children
}

function addTimer() {
  children.push({
    type: 'timer',
    name: `Timer ${children.length + 1}`
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
        <Clock {...child} bind:name={child.name} bind:filled={child.filled} />
      {:else if child.type === 'counter'}
        <Counter {...child} bind:value={child.value} />
      {:else if child.type === 'timer'}
        <Timer {...child} bind:elapsed={child.elapsed} />
      {/if}
    {/each}
  </div>
  <div class="counters-section__add-child">
    Add:
    <a href="javascript:;" class="counters-section__add-clock" on:click|preventDefault={addClock}>🕒</a>
    <a href="javascript:;" class="counters-section__add-counter" on:click|preventDefault={addCounter}>#️</a>
    <a href="javascript:;" class="counters-section__add-timer" on:click|preventDefault={addTimer}>⏳</a>
  </div>
</section>
