import { MarkdownRenderChild } from 'obsidian'

import Panel from './views/Panel.svelte'

export default class CountersRenderChild extends MarkdownRenderChild {
  element: HTMLElement

  constructor (options: { element: HTMLElement }) {
    super(options.element)

    this.element = options.element
  }

  async onload () {
    new Panel({
      target: this.element
    })
  }
}
