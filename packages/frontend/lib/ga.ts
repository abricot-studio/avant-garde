export const event = ({ action, params }) => {
  // console.log('ga event', { action, params })
  // @ts-ignore
  window.gtag('event', action, params)
}
