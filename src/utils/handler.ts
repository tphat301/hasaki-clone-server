import { RequestHandler, Request, Response, NextFunction } from 'express'

export default function wrapRequestHandler<P>(func: RequestHandler<P, any, any, any>) {
  return async function (req: Request<P>, res: Response, next: NextFunction) {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
