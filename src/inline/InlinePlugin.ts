import {
  Decoration,
  EditorView,
  ViewPlugin,
  ViewUpdate
} from '@codemirror/view'

import type {
  DecorationSet
} from '@codemirror/view'

import {
  syntaxTree
} from '@codemirror/language'

import type {
  EditorSelection,
  Range
} from '@codemirror/state'

import { editorLivePreviewField } from 'obsidian'

import type ProgressClocksPlugin from '../ProgressClocksPlugin'

import ClockWidget from './ClockWidget'
import CounterWidget from './CounterWidget'

const DEFAULT_CLOCK_SEGMENTS = 4

const CLOCK_PATTERN = new RegExp(/^clock(?:\s+(\d+)\s*(?:\/\s*(\d+))?)?/i)
const COUNTER_PATTERN = new RegExp(/^counter(?:\s+(\d+))?/i)

function isSelectionWithin(selection: EditorSelection, rangeFrom: number, rangeTo: number): boolean {
  for (const range of selection.ranges) {
    if (range.from <= rangeTo && range.to >= rangeFrom) {
      return true
    }
  }

  return false
}

export type ClockDetails = {
  segments: number,
  filled: number
}

export type CounterDetails = {
  value: number
}

export function parseCode (input: string) {
  input = input.trim()

  let match = CLOCK_PATTERN.exec(input)
  if (match) {
    const segments = match[2] ? Number(match[2]) : match[1] ? Number(match[1]) : DEFAULT_CLOCK_SEGMENTS
    const filled = match[2] ? Number(match[1]) : 0

    return {
      type: 'clock',
      segments,
      filled
    }
  }

  match = COUNTER_PATTERN.exec(input)
  if (match) {
    const value = match[1] ? Number(match[1]) : 0

    return {
      type: 'counter',
      value
    }
  }

  return null
}

export class InlinePlugin {
  decorations: DecorationSet
  showButtonsForInlineClocks: boolean
  allowClickInteractionForInlineClocks: boolean

  constructor (view: EditorView) {
    this.decorations = Decoration.none
  }

  update (update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged || update.selectionSet) {
      if (update.state.field(editorLivePreviewField)) {
        this.decorations = this.inlineRender(update.view)
      } else {
        this.decorations = Decoration.none;
      }
    }
  }

  inlineRender (view: EditorView) {
    const widgets: Range<Decoration>[] = []

    for (const { from, to } of view.visibleRanges) {
      syntaxTree(view.state).iterate({
        from,
        to,
        enter: ({ node }) => {
          if (/formatting/.test(node.name)) {
            return
          }

          if (!/.*?_?inline-code_?.*/.test(node.name)) {
            return
          }


          if (isSelectionWithin(view.state.selection, node.from, node.to)) {
            return
          }

          const src = view.state.doc.sliceString(node.from, node.to).trim()
          const parsed = parseCode(src)

          if (!parsed) {
            return
          }

          switch (parsed.type) {
            case 'clock': {
              const { segments, filled } = parsed

              widgets.push(Decoration.replace({
                widget: new ClockWidget(segments, filled, node.from, node.to,
                  this.showButtonsForInlineClocks, this.allowClickInteractionForInlineClocks)
              }).range(node.from, node.to))

              break
            }
            case 'counter': {
              const { value } = parsed

              widgets.push(Decoration.replace({
                widget: new CounterWidget(value, node.from, node.to)
              }).range(node.from, node.to))

              break
            }
          }
        }
      })
    }

    return Decoration.set(widgets)
  }
}

export function inlinePlugin (plugin: ProgressClocksPlugin) {
  return ViewPlugin.define((view) => {
    const viewPlugin = new InlinePlugin(view);
    viewPlugin.showButtonsForInlineClocks = plugin.settings.showButtonsForInlineClocks;
    viewPlugin.allowClickInteractionForInlineClocks = plugin.settings.allowClickInteractionForInlineClocks;
    return viewPlugin;
  }, {decorations: (view) => view.decorations});
}
