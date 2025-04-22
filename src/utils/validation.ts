import { Request, Response, NextFunction } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import STATUS_CODE from '~/constants/statusCode'
import { ErrorUnProcessableUntity, ErrorWithStatus } from '~/models/schemas/Errors'

export default function validate(validation: RunnableValidationChains<ValidationChain>) {
  return async function (req: Request, res: Response, next: NextFunction) {
    await validation.run(req)
    const errors = validationResult(req)
    const errorsObject = errors.mapped()
    const ErrorsUnProcessalbeUnityObject = new ErrorUnProcessableUntity({ errors: {} })
    if (!errors.isEmpty()) {
      for (const key in errorsObject) {
        const { msg } = errorsObject[key]
        if (msg instanceof ErrorWithStatus && msg.status !== STATUS_CODE.UNPROCESSABLE_ENTITY) {
          return next(msg)
        }
        ErrorsUnProcessalbeUnityObject['errors']['msg'] = errorsObject[key]
      }
      next(ErrorsUnProcessalbeUnityObject)
    }
    next()
  }
}
