/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

const isBrowser = typeof window !== `undefined`

function getBreakpoint() {
  if (!isBrowser) return ''
  return window.getComputedStyle(document.body, ':before').content.replace(/\"/g, '')
}

export function useCssBreakpoints(effect, deps, wait) {
  const ref = useRef(getBreakpoint())
  let throttleTimeout = null

  const callBack = () => {
    const breakpoint = getBreakpoint()
    effect({ prevBreakpoint: ref.current, breakpoint })
    ref.current = breakpoint
    throttleTimeout = null
  }

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) {
      return
    }

    const handleResize = function() {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = setTimeout(callBack, wait)
        }
      } else {
        callBack()
      }
    }

    window.addEventListener('resize', handleResize)

    if (wait) {
      if (throttleTimeout === null) {
        throttleTimeout = setTimeout(callBack, wait);
      }
    }
 
    return () => window.removeEventListener('resize', handleResize)
  }, deps)
}

useCssBreakpoints.defaultProps = {
  deps: [],
  wait: 10,
}
