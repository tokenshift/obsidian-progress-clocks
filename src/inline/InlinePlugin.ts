import {
  Decoration,
  EditorView,
  ViewPlugin,
  ViewUpdate
} from '@codemirror/view'

import type {
  DecorationSet,
  PluginValue
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

const CLOCK_PATTERN = new RegExp(/clock(?:\s+(\d+)\s*(?:\/\s*(\d+))?)?/i)
const COUNTER_PATTERN = new RegExp(/counter(?:\s+(\d+))?/i)
const EXCLUDE_NODE_NAMES_PATTERN = /formatting/
const USE_NODE_NAMES_PATTERN = /.*?_?inline-code_?.*/
const TABLE_NODE_NAMES_PATTERN = /HyperMD-table-row/

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

export function parseCode(input: string) {
  input = input.trim()

  let match = CLOCK_PATTERN.exec(input)
  if (match) {
    const segments = match[2] ? Number(match[2]) : match[1] ? Number(match[1]) : DEFAULT_CLOCK_SEGMENTS
    const filled = match[2] ? Number(match[1]) : 0

    return {
      type: 'clock' as const,
      segments,
      filled
    }
  }

  match = COUNTER_PATTERN.exec(input)
  if (match) {
    const value = match[1] ? Number(match[1]) : 0

    return {
      type: 'counter' as const,
      value
    }
  }

  return null
}

type ParseResult = NonNullable<ReturnType<typeof parseCode>>

function placeWidget(parsed: ParseResult, from: number, to: number): Range<Decoration> {
  switch (parsed.type) {
    case 'clock':
      const { segments, filled } = parsed
      return Decoration.replace({
        widget: new ClockWidget(segments, filled, from, to)
      }).range(from, to)

    case 'counter':
      const { value } = parsed
      return Decoration.replace({
        widget: new CounterWidget(value, from, to)
      }).range(from, to)
  }
}

export class InlinePlugin implements PluginValue {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = Decoration.none
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged || update.selectionSet) {
      if (update.state.field(editorLivePreviewField)) {
        this.decorations = this.inlineRender(update.view)
      } else {
        this.decorations = Decoration.none;
      }
    }
  }

  inlineRender(view: EditorView) {
    const widgets: Range<Decoration>[] = []

    for (const { from, to } of view.visibleRanges) {
      syntaxTree(view.state).iterate({
        from,
        to,
        enter: ({ node }) => {
          if (EXCLUDE_NODE_NAMES_PATTERN.test(node.name)) {
            return
          }

          if (isSelectionWithin(view.state.selection, node.from, node.to)) {
            return
          }

          const widgetSites: [ParseResult, number, number][] = []

          const nodeSrc = view.state.doc.sliceString(node.from, node.to).trim()

          if (USE_NODE_NAMES_PATTERN.test(node.name)) {
            const parsed = parseCode(nodeSrc)
            if (parsed) widgetSites.push([parsed, node.from, node.to])
          } else if (TABLE_NODE_NAMES_PATTERN.test(node.name)) {
            let from = nodeSrc.startsWith('|') ? 1 : 0
            let to = from
            for (const cell of nodeSrc.split('|')) {
              to = from + cell.length
              const parsed = parseCode(cell)
              if (parsed) widgetSites.push([parsed, from, to])
              from = to + 1
            }
          }

          widgets.push(...widgetSites.map((args) => placeWidget(...args)))
        }
      })
    }
    return Decoration.set(widgets, true)
  }
}

export function inlinePlugin(plugin: ProgressClocksPlugin) {
  return ViewPlugin.fromClass(InlinePlugin, {
    decorations: (view) => view.decorations
  })
}
