import { VercelRequest, VercelResponse } from '@vercel/node'
import { Middlewares } from '../libs/middlewares'

export default (
  req: VercelRequest,
  res: VercelResponse
): VercelResponse | void => {
  if (!Middlewares(req, res)) return

  res.status(200).send(`pong ${Date.now()}`)
}
