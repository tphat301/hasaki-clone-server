import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import STATUS_CODE from '~/constants/statusCode'
import { ErrorWithStatus } from '~/models/schemas/Errors'

export default function defaultErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ErrorWithStatus) {
    res.status(err.status).json(omit(err, ['status']))
    return
  }

  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    error_info: omit(err, ['stack'])
  })
  return
}
