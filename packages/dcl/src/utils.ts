import { Delay, Interval } from '@dcl/ecs-scene-utils'

export interface ITimeoutClean {
  clearTimeout(): void
}

export function setTimeout(cb: Function, ms: number): ITimeoutClean {
  const ent = new Entity()
  engine.addEntity(ent)
  const delay = new Delay(ms, () => {
    cb()
    engine.removeEntity(ent)
  })
  ent.addComponent(delay)

  return {
    clearTimeout() {
      delay.setCallback(() => {})
    },
  }
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), ms))
}

interface IIntervalClean {
  clearInterval(): void
}

export function setInterval(cb: Function, ms: number): IIntervalClean {
  const ent = new Entity()
  engine.addEntity(ent)
  const interval = new Interval(ms, () => {
    cb()
  })
  ent.addComponent(interval)

  return {
    clearInterval() {
      interval.setCallback(() => {})
      engine.removeEntity(ent)
    },
  }
}

export function arrayOfLength(length: number) {
  const arr = []

  for (let i = 0; i < length; i++) {
    arr.push(i)
  }

  return arr
}
