import { memoize } from 'lodash'

export const URLs = {
  github: 'https://github.com/abricot-studio/avant-garde',
  twitter: 'https://twitter.com/avantgardenft',
  discord: 'https://discord.gg/tQbXBBcpTD',
}

export const contractConstants = {
  bc: {
    a: 2,
    b: 10000,
  },
  platformFees: 0.1,
}

export const bondingCurveFn = memoize(
  (i) => Math.pow(i, contractConstants.bc.a) / contractConstants.bc.b
)
