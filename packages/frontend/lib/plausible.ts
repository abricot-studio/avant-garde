const noop = () => undefined

function getPlausible() {
  return typeof window !== 'undefined' ? window['plausible'] : noop
}

export function sendEvent(name: string, props?: any) {
  if (process.env.ENABLE_ANALYTICS) getPlausible()(name, props)
}
