import type { MarkdownPostProcessorContext, WorkspaceLeaf } from 'obsidian'
import { Plugin } from 'obsidian'

import ProgressClocksView, { VIEW_TYPE } from './ProgressClocksView'
import { inlinePlugin, parseCode } from './inline/InlinePlugin'
import Clock from './ui/Clock.svelte'
import Counter from './ui/Counter.svelte'

export default class ProgressClocksPlugin extends Plugin {
  async onload() {
    this.registerView(
      VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new ProgressClocksView(this, leaf))

    this.addView()

    this.addCommand({
      id: 'open-panel',
      name: 'Open the sidebar view',
      callback: async () => {
        const leaf = await this.addView()
        if (leaf) {
          this.app.workspace.revealLeaf(leaf)
        }
      }
    })

    this.registerEditorExtension(inlinePlugin(this))

    this.registerMarkdownPostProcessor(this.handleMarkdownPostProcessor.bind(this))
  }

  async addView() {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length > 0) {
      return this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
    }

    await this.app.workspace?.getRightLeaf(false)?.setViewState({
      type: VIEW_TYPE
    });

    return this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
  }

  async handleMarkdownPostProcessor(el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    const nodes = el.querySelectorAll('code')

    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[i]
      const parsed = parseCode(node.innerText)

      if (!parsed) { continue }

      const container = document.createElement('div')
      container.addClass('progress-clocks-inline')

      switch (parsed.type) {
        case 'clock':
          const { segments, filled } = parsed
          new Clock({
            target: container,
            props: {
              segments,
              filled
            }
          })

          node.replaceWith(container)

          break
        case 'counter':
          const { value } = parsed

          new Counter({
            target: container,
            props: {
              value
            }
          })

          node.replaceWith(container)

          break
      }
    }
  }
}
