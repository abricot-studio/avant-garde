import config from '../config'

export const event = ({ action, params }) => {
  console.log('ga event', { action, params })
  if(config.enableAnalytics){
    // @ts-ignore
    window.gtag('event', action, params)
  }
}
