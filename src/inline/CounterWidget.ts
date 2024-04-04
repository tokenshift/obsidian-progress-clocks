import { 
  EditorView,
  WidgetType
} from '@codemirror/view'
  
import Counter from '../ui/Counter.svelte'

type UpdateEvent = {
  detail: {
    value: number
  }
}

export default class CounterWidget extends WidgetType {
  constructor (
    readonly value: number = 0,
    readonly nodeFrom: number,
    readonly nodeTo: number) {
    super()
  }

  toDOM (view: EditorView): HTMLElement {
    const container = document.createElement('div')
    container.addClass('progress-clocks-inline')
    
    const counter = new Counter({
      target: container,
      props: {
        value: this.value
      }
    })

    counter.$on('updated', (event: UpdateEvent) => {
      const {
        detail: {
          value
        }
      } = event

      view.dispatch({
        changes: {
          from: this.nodeFrom,
          to: this.nodeTo,
          insert: `counter ${value}`
        }
      })
    })

    return container
  }
}
