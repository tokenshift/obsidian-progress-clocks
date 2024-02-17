import { MarkdownRenderChild } from 'obsidian'

import Counters from './views/Counters.svelte'

export default class CountersRenderChild extends MarkdownRenderChild {
  element: HTMLElement

  constructor (options: { element: HTMLElement }) {
    super(options.element)

    this.element = options.element
  }

  async onload () {
    new Counters({
      target: this.element
    })
  }
}
