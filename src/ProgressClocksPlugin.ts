import type { MarkdownPostProcessorContext, WorkspaceLeaf } from 'obsidian'
import { Plugin } from 'obsidian'

import ProgressClocksRenderChild from './ProgressClocksRenderChild'
import ProgressClocksView, { VIEW_TYPE } from './ProgressClocksView'

import { inlinePlugin } from './inline/InlinePlugin'

export default class ProgressClocksPlugin extends Plugin {
  async onload () {
    this.registerMarkdownCodeBlockProcessor('counters', (source, el, ctx) => this.handleCountersCodeBlock(source, el, ctx))

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
  }

  async addView () {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length > 0) {
      return this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
    }

    await this.app.workspace?.getRightLeaf(false)?.setViewState({
        type: VIEW_TYPE
    });

    return this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
  }

  async handleCountersCodeBlock (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    try {
      const child = new ProgressClocksRenderChild(this, el)
      ctx.addChild(child)
    } catch (err) {
      const pre = document.createElement('pre')
      pre.append(err.message)
      if (err.stack) {
        pre.append('\n')
        pre.append(err.stack)
      }
      el.append(pre)
    }
  }
}
