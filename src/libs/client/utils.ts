export function cls(...classnames: string[]) {
  return classnames.join(" ")
}

export function eventFit(callback: any) {
  let tick = false
  return function trigger() {
    if (tick) {
      return
    }
    tick = true
    return requestAnimationFrame(function task() {
      tick = false
      return callback()
    })
  }
}
