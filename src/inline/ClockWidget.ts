import { 
  EditorView,
  WidgetType
} from '@codemirror/view'
  
import Clock from '../ui/Clock.svelte'

type UpdateEvent = {
  detail: {
    segments: number
    filled: number
  }
}

export default class ClockWidget extends WidgetType {
  constructor (
    readonly segments: number = 4,
    readonly filled: number = 0,
    readonly nodeFrom: number,
    readonly nodeTo: number) {
    super()
  }

  toDOM (view: EditorView): HTMLElement {
    const container = document.createElement('div')
    container.addClass('progress-clocks-inline')
    
    const clock = new Clock({
      target: container,
      props: {
        segments: this.segments,
        filled: this.filled
      }
    })

    clock.$on('updated', (event: UpdateEvent) => {
      const {
        detail: {
          segments,
          filled
        }
      } = event

      view.dispatch({
        changes: {
          from: this.nodeFrom,
          to: this.nodeTo,
          insert: `clock ${filled} / ${segments}`
        }
      })
    })

    return container
  }
}
