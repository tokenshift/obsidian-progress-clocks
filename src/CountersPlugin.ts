import type { MarkdownPostProcessorContext, WorkspaceLeaf } from 'obsidian'
import { Plugin } from 'obsidian'

import CountersRenderChild from './CountersRenderChild'
import CountersView, { VIEW_TYPE } from './CountersView'

export default class CountersPlugin extends Plugin {
  async onload () {
    this.registerMarkdownCodeBlockProcessor('counters', (source, el, ctx) => this.handleCountersCodeBlock(source, el, ctx))

    this.registerView(
      VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new CountersView(this, leaf))

    if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length > 0) {
        return;
    }
    await this.app.workspace.getRightLeaf(false).setViewState({
        type: VIEW_TYPE
    });
  }

  async handleCountersCodeBlock (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    try {
      const child = new CountersRenderChild({ plugin: this, element: el })
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
