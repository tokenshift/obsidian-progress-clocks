import type ProgressClocksPlugin from './ProgressClocksPlugin'
import { ItemView, WorkspaceLeaf, debounce } from 'obsidian'
import Panel from './ui/Panel.svelte'

export const DISPLAY_TEXT = 'Progress Clocks'
export const ICON = 'pie-chart' // Icons from https://lucide.dev/icons/
export const VIEW_TYPE = 'PROGRESS_CLOCKS_VIEW'

const DEBOUNCE_SAVE_STATE_TIME = 1000

export default class ProgressClocksView extends ItemView {
  navigation = false

  constructor(public plugin: ProgressClocksPlugin, public leaf: WorkspaceLeaf) {
    super(leaf)
  }

  getDisplayText(): string {
    return DISPLAY_TEXT
  }

  getIcon(): string {
    return ICON
  }

  getViewType(): string {
      return VIEW_TYPE
  }

  async onOpen() {
    this.contentEl.empty()

    const data = await this.plugin.loadData()
    const state = data?.state || { sections: [] }

    const panel = new Panel({
      target: this.contentEl,
      props: {
        showTitle: true,
        state,
        version: this.plugin.manifest.version
      }
    })

    panel.$on('stateUpdated', debounce(({ detail: { state } }) => {
      this.plugin.saveData({ state })
    }, DEBOUNCE_SAVE_STATE_TIME, true))

  }
}