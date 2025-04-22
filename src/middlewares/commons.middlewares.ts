import { Request, Response, NextFunction } from 'express'
import { pick } from 'lodash'

type Filters<T> = Array<keyof T>
export const filterMiddleware = <T>(filters: Filters<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filters)
    next()
  }
}
