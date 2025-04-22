import STATUS_CODE from '~/constants/statusCode'

type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ status, message }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class ErrorUnProcessableUntity extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message = 'Validation Error', errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: STATUS_CODE.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
