import { Request, Response, NextFunction } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import { CONFIG_ENV } from '~/constants/config'
import { VerifyStatusAccount } from '~/constants/enum'
import { CLIENT_MESSAGE } from '~/constants/message'
import STATUS_CODE from '~/constants/statusCode'
import { TokenPayLoad } from '~/models/requests/client/User.requests'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import usersService from '~/services/client/users.services'
import databasesService from '~/services/databases.services'
import hashPassword from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import validate from '~/utils/validation'

/* Declare variable schema */
const emailSchema: ParamSchema = {
  notEmpty: {
    errorMessage: CLIENT_MESSAGE.EMAIL_NOT_EMPTY
  },
  isString: {
    errorMessage: CLIENT_MESSAGE.EMAIL_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 5,
      max: 160
    },
    errorMessage: CLIENT_MESSAGE.EMAIL_LENGTH
  },
  isEmail: {
    errorMessage: CLIENT_MESSAGE.EMAIL_INVALID
  }
}

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: CLIENT_MESSAGE.PASSWORD_NOT_EMPTY
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 160
    },
    errorMessage: CLIENT_MESSAGE.PASSWORD_LENGTH
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: CLIENT_MESSAGE.PASSWORD_IS_NOT_STRONG
  }
}

const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: CLIENT_MESSAGE.CONFIRM_PASSWORD_NOT_EMPTY
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: CLIENT_MESSAGE.CONFIRM_PASSWORD_LENGTH
  }
}

const forgotPasswordTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: CLIENT_MESSAGE.FORGOT_PASSWORD_IS_REQUIRED,
          status: STATUS_CODE.UNAUTHORIZED
        })
      }
      try {
        const decode_forgot_password_token = await verifyToken({
          token: value,
          secretOrPublicKey: CONFIG_ENV.JWT_FORGOT_PASSWORD_TOKEN_SECRET_KEY
        })
        const { user_id } = decode_forgot_password_token
        const user = await databasesService.users.findOne({ _id: new ObjectId(user_id) })
        if (user === null) {
          throw new ErrorWithStatus({
            message: CLIENT_MESSAGE.USER_NOT_FOUND,
            status: STATUS_CODE.NOT_FOUND
          })
        }
        if (user.forgot_password_token !== value) {
          throw new ErrorWithStatus({
            message: CLIENT_MESSAGE.FORGOT_PASSWORD_TOKEN_INVALID,
            status: STATUS_CODE.UNAUTHORIZED
          })
        }
        ;(req as Request).decode_forgot_password_token = decode_forgot_password_token
        return true
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: capitalize(error.message),
            status: STATUS_CODE.UNAUTHORIZED
          })
        }
        throw error
      }
    }
  }
}

const nameSchema: ParamSchema = {
  isString: {
    errorMessage: CLIENT_MESSAGE.NAME_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 160
    },
    errorMessage: CLIENT_MESSAGE.NAME_LENGTH
  }
}

const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: CLIENT_MESSAGE.DATE_OF_BIRTH_ISO8601
  }
}

const avatarSchema: ParamSchema = {
  isString: {
    errorMessage: CLIENT_MESSAGE.AVATAR_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 1000
    },
    errorMessage: CLIENT_MESSAGE.AVATAR_LENGTH
  }
}

const addressSchema: ParamSchema = {
  isString: {
    errorMessage: CLIENT_MESSAGE.ADDRESS_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 160
    },
    errorMessage: CLIENT_MESSAGE.ADDRESS_MUST_BE_FROM_6_TO_160
  }
}

const phoneSchema: ParamSchema = {
  isString: {
    errorMessage: CLIENT_MESSAGE.PHONE_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 10,
      max: 20
    },
    errorMessage: CLIENT_MESSAGE.PHONE_LENGTH
  }
}

/* Declare functional schema */
export const registerValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string) => {
            const user = await usersService.checkEmailExisted(value)
            if (user) {
              throw new ErrorWithStatus({
                message: CLIENT_MESSAGE.EMAIL_ALREADY_EXISTS,
                status: STATUS_CODE.CONFLICT
              })
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirm_password: {
        ...confirmPasswordSchema,
        custom: {
          options: (value: string, { req }) => {
            if (value !== req.body.password) {
              throw new Error(CLIENT_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyEmailValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        isString: true,
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: CLIENT_MESSAGE.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                status: STATUS_CODE.UNAUTHORIZED
              })
            }

            try {
              const decode_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: CONFIG_ENV.JWT_EMAIL_VERIFY_TOKEN_SECRET_KEY
              })
              const { user_id } = decode_email_verify_token
              const user = await databasesService.users.findOne({ _id: new ObjectId(user_id) })
              if (user === null) {
                throw new ErrorWithStatus({
                  message: CLIENT_MESSAGE.USER_NOT_FOUND,
                  status: STATUS_CODE.NOT_FOUND
                })
              }
              if (user.email_verify_token === '') {
                throw new ErrorWithStatus({
                  message: CLIENT_MESSAGE.ACCOUNT_IS_VERIFIED,
                  status: STATUS_CODE.CONFLICT
                })
              }
              ;(req as Request).decode_email_verify_token = decode_email_verify_token
              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: STATUS_CODE.UNAUTHORIZED
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            try {
              if (!access_token) {
                throw new ErrorWithStatus({
                  message: CLIENT_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
                  status: STATUS_CODE.UNAUTHORIZED
                })
              }
              const decode_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: CONFIG_ENV.JWT_ACCESS_TOKEN_SECRET_KEY
              })
              ;(req as Request).decode_authorization = decode_authorization
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: STATUS_CODE.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: CLIENT_MESSAGE.REFRESH_TOKEN_IS_REQUIRED,
                status: STATUS_CODE.UNAUTHORIZED
              })
            }
            try {
              const [decode_refresh_token, refresh_token] = await Promise.all([
                verifyToken({
                  token: value,
                  secretOrPublicKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY
                }),
                databasesService.refreshTokens.findOne({ token: value })
              ])

              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: CLIENT_MESSAGE.REFRESH_TOKEN_NOT_FOUND,
                  status: STATUS_CODE.NOT_FOUND
                })
              }
              ;(req as Request).decode_refresh_token = decode_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: STATUS_CODE.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const resendVerifyEmailValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const user = await databasesService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return next(
      new ErrorWithStatus({
        message: CLIENT_MESSAGE.USER_NOT_FOUND,
        status: STATUS_CODE.NOT_FOUND
      })
    )
  }
  if (user.verify === VerifyStatusAccount.Verified) {
    return next(
      new ErrorWithStatus({
        message: CLIENT_MESSAGE.ACCOUNT_IS_VERIFIED,
        status: STATUS_CODE.CONFLICT
      })
    )
  }
  ;(req as Request).user = user
  next()
}

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databasesService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user === null) {
              throw new Error(CLIENT_MESSAGE.EMAIL_OR_PASSWORD_INCORRECT)
            }
            ;(req as Request).user = user
            return true
          }
        }
      },
      password: passwordSchema
    },
    ['body']
  )
)

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decode_authorization as TokenPayLoad
  if (verify !== VerifyStatusAccount.Verified) {
    return next(
      new ErrorWithStatus({
        message: CLIENT_MESSAGE.ACCOUNT_UNVERIFIED,
        status: STATUS_CODE.FORBIDDEN
      })
    )
  }
  next()
}

export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        ...passwordSchema,
        custom: {
          options: async (value: string, { req }) => {
            const { user_id } = (req as Request).decode_authorization as TokenPayLoad
            const user = await databasesService.users.findOne({ _id: new ObjectId(user_id) })
            if (!user) {
              throw new ErrorWithStatus({
                message: CLIENT_MESSAGE.USER_NOT_FOUND,
                status: STATUS_CODE.NOT_FOUND
              })
            }
            if (user.password !== hashPassword(value)) {
              throw new ErrorWithStatus({
                message: CLIENT_MESSAGE.OLD_PASSWORD_INCORRECT,
                status: STATUS_CODE.UNPROCESSABLE_ENTITY
              })
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirm_password: {
        ...confirmPasswordSchema,
        custom: {
          options: (value: string, { req }) => {
            if (value !== req.body.password) {
              throw new Error(CLIENT_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databasesService.users.findOne({ email: value })
            if (!user) {
              throw new ErrorWithStatus({
                message: CLIENT_MESSAGE.USER_NOT_FOUND,
                status: STATUS_CODE.NOT_FOUND
              })
            }
            ;(req as Request).user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswordTokenSchema,
      password: passwordSchema,
      confirm_password: {
        ...confirmPasswordSchema,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(CLIENT_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        ...nameSchema,
        optional: true
      },
      date_of_birth: {
        ...dateOfBirthSchema,
        optional: true
      },
      avatar: {
        ...avatarSchema,
        optional: true
      },
      address: {
        ...addressSchema,
        optional: true
      },
      phone: {
        ...phoneSchema,
        optional: true
      }
    },
    ['body']
  )
)
