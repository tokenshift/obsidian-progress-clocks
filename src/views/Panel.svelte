<script lang="ts">
import type { ClockParams } from './Clock.svelte'
import type { CounterParams } from './Counter.svelte'
import Section from './Section.svelte'
import type { TimerParams } from './Timer.svelte'

export let sections: {
  name: string
  children: (ClockParams | CounterParams | TimerParams)[]
}[] = [
  {
    name: 'Test Section',
    children: [
      {
        type: 'clock',
        segments: 6,
        filled: 2
      },
      {
        type: 'clock',
        segments: 4,
        filled: 1
      },
      {
        type: 'timer'
      },
      {
        type: 'clock',
        segments: 8,
        filled: 3
      }
    ]
  },
  {
    name: 'Another Section',
    children: [
      {
        type: 'clock',
        segments: 4
      },
      {
        type: 'timer',
        showMilliseconds: true
      },
      {
        type: 'clock',
        segments: 6,
        filled: 2
      },
      {
        type: 'counter',
        min: 0
      },
      {
        type: 'counter',
        value: 42
      }
    ]
  }
]

function addSection() {
  sections.push({ name: `Section ${sections.length + 1}`, children: [] })
  sections = sections
}

function removeSection(i: number) {
  sections.splice(i, 1)
  sections = sections
}
</script>

<div class="counters-panel">
  {#each sections as section, i}
    <Section bind:name={section.name} bind:children={section.children} on:removeSection={() => removeSection(i)} />
  {/each}
  <a href="javascript:;" class="counters-panel__add-section" on:click={addSection}>Add Section</a>
</div>
