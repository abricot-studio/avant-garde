import fs from 'fs'
import assert from 'assert'
import Jpeg from 'jpeg-js'

import { Log } from '../logger'

const logger = Log({ service: 'viewer' })

export class Viewer {
  height: number
  width: number
  baseDir: string

  constructor(height: number, width: number, outputsDir: string) {
    this.height = height
    this.width = width
    this.baseDir = outputsDir
  }

  async draw(data: any, id?: any): Promise<string> {
    assert(data.length === this.height * this.width * 4, 'data_size_wrong')

    const rawImageData = {
      data: data,
      width: this.width,
      height: this.height,
    }

    const path = `${this.baseDir}/out${id ? `_${id}` : ''}.jpg`
    const stream = fs.createWriteStream(path)

    const encoded = Jpeg.encode(rawImageData, 100)
    stream.write(encoded.data)
    stream.end()

    return new Promise((resolve: any) => {
      stream.on('finish', () => {
        logger.info('Written file', { path })
        resolve(path)
      })
    })
  }

  getPath(id?: string) {
    return `${this.baseDir}/out${id ? `_${id}` : ''}.jpg`
  }

  rm(id?: string) {
    const path = `${this.baseDir}/out${id ? `_${id}` : ''}.jpg`

    return new Promise((resolve: any, reject: any) => {
      fs.unlink(path, (error) => {
        if (error) {
          reject(error)
        }

        logger.info('Remove file', { path })

        resolve(path)
      })
    })
  }
}
