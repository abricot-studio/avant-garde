import { VercelRequest, VercelResponse } from '@vercel/node'
import { config } from './config'

export function Middlewares(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  if (
    req.headers['x-vercel-ip-country'] &&
    config.countries.includes(req.headers['x-vercel-ip-country'].toString())
  ) {
    return res.status(400).end()
  }
}
