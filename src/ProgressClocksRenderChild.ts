import { MarkdownRenderChild, debounce } from 'obsidian'

import Panel from './ui/Panel.svelte'
import type ProgressClocksPlugin from './ProgressClocksPlugin'

const DEBOUNCE_SAVE_STATE_TIME = 1000

export default class ProgressClocksRenderChild extends MarkdownRenderChild {
  constructor (public plugin: ProgressClocksPlugin, public element: HTMLElement) {
    super(element)
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
