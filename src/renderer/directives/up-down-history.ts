import { App } from 'vue'

export function install (app: App) {
  app.directive('up-down-history', {
    mounted (el, binding) {
      const { value = {} } = binding
      const { maxLength = 50 } = value

      const history: string[] = []
      let index = -1

      const toggle = (e: KeyboardEvent) => {
        if (history.length === 0) {
          return
        }

        const target = e.target as HTMLInputElement
        const offset = e.key === 'ArrowUp' ? -1 : 1

        if (target.tagName === 'INPUT') {
          e.preventDefault()
        } else if (target.selectionStart === target.selectionEnd) {
          const style = window.getComputedStyle(target)
          const singleHeight = parseFloat(style.lineHeight) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
          if (
            (!target.value.includes('\n') && target.clientHeight < singleHeight + 4) ||
            (offset < 0 && target.selectionStart === 0) ||
            (offset > 0 && target.selectionEnd === target.value.length)
          ) {
            e.preventDefault()
          } else {
            return
          }
        }

        index += offset

        if (index < 0) {
          index = 0
        } else if (index >= history.length) {
          index = history.length - 1
        }

        el.value = history[index]
        el.dispatchEvent(new Event('input'))
      }

      el.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.isComposing) {
          return
        }

        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
          return
        }

        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          toggle(e)
        } else if (e.key === 'Enter') {
          if (el.value && el.value !== history[index]) {
            if (history.length >= maxLength) {
              history.shift()
            }

            history.push(el.value)
            index = history.length - 1
          }
        }
      })
    }
  })
}
