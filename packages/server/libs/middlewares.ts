import { VercelRequest, VercelResponse } from '@vercel/node'
import { config } from './config'

export function Middlewares(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return false
  }
  if (
    req.headers['x-vercel-ip-country'] &&
    config.countries.includes(req.headers['x-vercel-ip-country'].toString())
  ) {
    res.status(400).end()
    return false
  }
  return true
}
