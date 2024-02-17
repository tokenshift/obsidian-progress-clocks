import type { MarkdownPostProcessorContext } from 'obsidian'
import { Plugin } from 'obsidian'

import CountersRenderChild from './CountersRenderChild'

export default class CountersPlugin extends Plugin {
  async onload () {
    this.registerMarkdownCodeBlockProcessor('counters', (source, el, ctx) => this.handleCountersCodeBlock(source, el, ctx))
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
