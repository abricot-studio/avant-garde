import { memoize } from 'lodash'

export const URLs = {
  github: 'https://github.com/abricot-studio/avant-garde',
  twitter: 'https://twitter.com/avantgardenft',
  discord: 'https://discord.gg/a9JX2wxQdF',
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

export const bondingCurveSum = memoize((i) => {
  let total = 0
  for (let j = 0; j < i; j++) {
    total += Math.pow(j + 1, contractConstants.bc.a) / contractConstants.bc.b
  }

  return total
})
