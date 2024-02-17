import { MarkdownRenderChild, debounce } from 'obsidian'

import Panel from './ui/Panel.svelte'
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
    const state = data?.state || { sections: [] }

    const panel = new Panel({
      target: this.element,
      props: { state, version: this.plugin.manifest.version }
    })

    panel.$on('stateUpdated', debounce(({ detail: { state } }) => {
      this.plugin.saveData({ state })
    }, DEBOUNCE_SAVE_STATE_TIME, true))
  }
}
