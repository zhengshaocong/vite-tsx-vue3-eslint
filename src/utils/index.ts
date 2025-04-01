import type { DebouncedFunc } from 'lodash'

export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  wait?: number
): DebouncedFunc<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      fn.apply(this, args)
      timeout = null
    }, wait || 300)
  } as DebouncedFunc<T>
}
