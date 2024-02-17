import { MarkdownRenderChild, debounce } from 'obsidian'

import Panel from './views/Panel.svelte'
import type CountersPlugin from './CountersPlugin'

const DEBOUNCE_SAVE_STATE_TIME = 1000

export default class CountersRenderChild extends MarkdownRenderChild {
  plugin: CountersPlugin
  element: HTMLElement

  constructor (options: {
    plugin: CountersPlugin,
    element: HTMLElement
  }) {
    super(options.element)

    this.plugin = options.plugin
    this.element = options.element
  }

  async onload () {
    const data = await this.plugin.loadData()
    const state = data.state || { sections: [] }

    console.log(state)

    const panel = new Panel({
      target: this.element,
      props: { state }
    })

    panel.$on('stateUpdated', debounce(({ detail: { state } }) => {
      this.plugin.saveData({ state })
    }, DEBOUNCE_SAVE_STATE_TIME, false))
  }
}
