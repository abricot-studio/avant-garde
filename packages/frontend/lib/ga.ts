export const event = ({ action, params }) => {
  // @ts-ignore
  window.gtag('event', action, params)
}
