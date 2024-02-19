<script lang="ts">
import { PieChart, PlusSquare, Timer, Trash2 } from 'lucide-svelte'
import { createEventDispatcher, tick } from 'svelte'
import { fade } from 'svelte/transition'

import EditableText from './EditableText.svelte'
import EditableNumber, { EditMode } from './EditableNumber.svelte'
import Clock from './Clock.svelte'
import Counter from './Counter.svelte'
import StopWatch from './StopWatch.svelte'

import type { SectionChild } from 'src/State'
import { ifClickEquivalent } from './util'

export let name: string
export let children: SectionChild[]

const dispatch = createEventDispatcher()

function raiseRemoveSection(e: MouseEvent | KeyboardEvent) {
  if (e instanceof MouseEvent || ['Enter', ' '].contains(e.key)) {
    dispatch('removeSection', { self: this })
  }
}

let addingClock = false
let newClockMode = EditMode.Edit
let newClockSegments = 4

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

function addStopwatch() {
  children.push({
    type: 'stopwatch',
    name: `Stopwatch ${children.length + 1}`,
    startMillis: new Date().getTime(),
    offsetMillis: 0,
    showMillis: false,
    isRunning: true,
    lapTimes: []
  })

  children = children
}

function removeChild(e: MouseEvent | KeyboardEvent, i: number) {
  children.splice(i, 1)
  children = children
}
</script>

<section class="progress-clocks-section" transition:fade={{ duration: 100 }}>
  <div class="progress-clocks-section__name">
    <EditableText bind:value={name} />
  </div>

  <div
    role="button"
    tabindex="0"
    class="progress-clocks-button progress-clocks-section__remove"
    on:click={raiseRemoveSection}
    on:contextmenu={raiseRemoveSection}
    on:keydown={raiseRemoveSection}>
    <Trash2 />
  </div>

  <div class="progress-clocks-section__children">
    {#each children as child, i}
      <div class="progress-clocks-section__child" data-child-type={child.type}>
        {#if child.type === 'clock'}
          <Clock {...child}
            bind:segments={child.segments}
            bind:filled={child.filled} />
        {:else if child.type === 'counter'}
          <Counter {...child}
            bind:value={child.value} />
        {:else if child.type === 'stopwatch'}
          <StopWatch {...child}
            bind:startMillis={child.startMillis}
            bind:offsetMillis={child.offsetMillis}
            bind:showMillis={child.showMillis}
            bind:isRunning={child.isRunning}
            bind:lapTimes={child.lapTimes} />
        {/if}

        <div class="progress-clocks-section__child-name">
          <EditableText bind:value={child.name} />
        </div>

        <div class="progress-clocks-section__remove-child">
          <div
            role="button"
            tabindex="0"
            class="progress-clocks-button progress-clocks-section__remove-child"
            on:click={(e) => removeChild(e, i)}
            on:keydown={ifClickEquivalent((e) => removeChild(e, i))}>
            <Trash2 />
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="progress-clocks-section__add-child">
    {#if addingClock}
    <EditableNumber
      bind:mode={newClockMode}
      bind:value={newClockSegments}
      on:confirmed={addClock}
      on:cancelled={() => { addingClock = false; newClockMode = EditMode.Edit } } />
    {:else}
    <button
      class="progress-clocks-section__add-clock"
      title="Add new progress clock"
      on:click={() => addingClock = true}>
      <PieChart />
    </button>
    {/if}
    <button
      class="progress-clocks-section__add-counter"
      title="Add new counter"
      on:click={addCounter}>
      <PlusSquare />
    </button>
    <button
      class="progress-clocks-section__add-stopwatch"
      title="Add new stopwatch"
      on:click={addStopwatch}>
      <Timer />
    </button>
  </div>
</section>
