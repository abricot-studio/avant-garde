import { VercelRequest, VercelResponse } from '@vercel/node'
import { Middlewares } from '../libs/middlewares'

export default (
  req: VercelRequest,
  res: VercelResponse
): VercelResponse | void => {
  Middlewares(req, res)

  res.status(200).send(`pong ${Date.now()}`)
}
