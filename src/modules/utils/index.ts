export const stopPropagation = (call?: Function, data?: any) => (e: any) => {
  e && e.stopPropagation && e.stopPropagation()
  e && e.stopImmediatePropagation && e.stopImmediatePropagation()
  call && call(e, data)
}
