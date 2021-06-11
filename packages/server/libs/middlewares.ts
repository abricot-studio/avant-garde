import { VercelRequest, VercelResponse } from '@vercel/node'
import { config } from './config'

export function Middlewares(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  console.log('Country', req.headers['X-Vercel-IP-Country'])
  if (
    req.headers['X-Vercel-IP-Country'] &&
    config.countries.includes(req.headers['X-Vercel-IP-Country'].toString())
  ) {
    return res.status(400).end()
  }
}
