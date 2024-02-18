<script lang="ts">
import { createEventDispatcher, tick } from 'svelte'
import { fade } from 'svelte/transition'

import EditableText from './EditableText.svelte'
import EditableNumber, { EditMode } from './EditableNumber.svelte'
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
  if (newClockMode !== EditMode.Read) { return }

  if (newClockSegments < 1) {
    tick().then(() => {
      newClockMode = EditMode.Edit
    })
    return
  }

  children.push({
    type: 'clock',
    name: `Clock ${children.length + 1}`,
    segments: newClockSegments,
    filled: 0
  })

  addingClock = false
  newClockMode = EditMode.Edit

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

let addingClock = false
let newClockMode = EditMode.Edit
let newClockSegments = 4
</script>

<section class="counters-section" transition:fade={{ duration: 100 }}>
  <div class="counters-section__name">
    <EditableText bind:value={name} />
  </div>
  <button class="counters-section__remove" on:click|preventDefault={raiseRemoveSection}>❌</button>
  <div class="counters-section__children">
    {#each children as child}
      <div class="counters-section__child">
        {#if child.type === 'clock'}
          <Clock {...child}
            bind:segments={child.segments}
            bind:filled={child.filled} />
        {:else if child.type === 'counter'}
          <Counter {...child}
            bind:value={child.value} />
        {:else if child.type === 'timer'}
          <Timer {...child}
            bind:startMillis={child.startMillis}
            bind:offsetMillis={child.offsetMillis}
            bind:showMillis={child.showMillis}
            bind:isRunning={child.isRunning} />
        {/if}
        <div class="counters-section__child-name">
          <EditableText bind:value={child.name} />
        </div>
      </div>
    {/each}
  </div>
  <div class="counters-section__add-child">
    Add:
    {#if addingClock}
    <EditableNumber bind:mode={newClockMode} bind:value={newClockSegments} on:modeChanged={addClock} />
    {:else}
    <button class="counters-section__add-clock" on:click|preventDefault={() => addingClock = true}>🕒</button>
    {/if}
    <button class="counters-section__add-counter" on:click|preventDefault={addCounter}>#️</button>
    <button class="counters-section__add-timer" on:click|preventDefault={addTimer}>⏳</button>
  </div>
</section>
