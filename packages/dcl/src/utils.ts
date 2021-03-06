import { Delay, Interval } from '@dcl/ecs-scene-utils'
import { isPreviewMode } from '@decentraland/EnvironmentAPI'

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

export function formatEther(wei: string) {
  return parseFloat(wei) / 10 ** 18
}

export function isPreview(): Promise<boolean> {
  return new Promise((resolve) => {
    executeTask(async () => {
      const preview: boolean = await isPreviewMode()

      if (preview) {
        log('Running in preview')
      }
      resolve(preview)
    })
  })
}
