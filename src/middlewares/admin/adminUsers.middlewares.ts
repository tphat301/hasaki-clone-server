import { Request, Response, NextFunction } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import { CONFIG_ENV } from '~/constants/config'
import { VerifyStatusAccount } from '~/constants/enum'
import { ADMIN_MESSAGE } from '~/constants/message'
import STATUS_CODE from '~/constants/statusCode'
import { AdminTokenPayLoad } from '~/models/requests/admin/AdminUser.requests'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import adminUsersService from '~/services/admin/adminUsers.services'
import databasesService from '~/services/databases.services'
import hashPassword from '~/utils/crypto'
import { verifyAdminToken } from '~/utils/jwt'
import validate from '~/utils/validation'

/* Declare variable schema */
const adminEmailSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.EMAIL_NOT_EMPTY
  },
  isString: {
    errorMessage: ADMIN_MESSAGE.EMAIL_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 5,
      max: 160
    },
    errorMessage: ADMIN_MESSAGE.EMAIL_LENGTH
  },
  isEmail: {
    errorMessage: ADMIN_MESSAGE.EMAIL_INVALID
  }
}

const adminPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.PASSWORD_NOT_EMPTY
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 160
    },
    errorMessage: ADMIN_MESSAGE.PASSWORD_LENGTH
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: ADMIN_MESSAGE.PASSWORD_IS_NOT_STRONG
  }
}

const adminConfirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.CONFIRM_PASSWORD_NOT_EMPTY
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: ADMIN_MESSAGE.CONFIRM_PASSWORD_LENGTH
  }
}

const adminForgotPasswordTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: ADMIN_MESSAGE.FORGOT_PASSWORD_IS_REQUIRED,
          status: STATUS_CODE.UNAUTHORIZED
        })
      }
      try {
        const admin_decode_forgot_password_token = await verifyAdminToken({
          token: value,
          secretOrPublicKey: CONFIG_ENV.JWT_ADMIN_FORGOT_PASSWORD_TOKEN_SECRET_KEY
        })
        const { user_id } = admin_decode_forgot_password_token
        const admin = await databasesService.admins.findOne({ _id: new ObjectId(user_id) })
        if (admin === null) {
          throw new ErrorWithStatus({
            message: ADMIN_MESSAGE.USER_NOT_FOUND,
            status: STATUS_CODE.NOT_FOUND
          })
        }
        if (admin.forgot_password_token !== value) {
          throw new ErrorWithStatus({
            message: ADMIN_MESSAGE.FORGOT_PASSWORD_TOKEN_INVALID,
            status: STATUS_CODE.UNAUTHORIZED
          })
        }
        ;(req as Request).admin_decode_forgot_password_token = admin_decode_forgot_password_token
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

const adminNameSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.NAME_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 160
    },
    errorMessage: ADMIN_MESSAGE.NAME_LENGTH
  }
}

const adminDateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: ADMIN_MESSAGE.DATE_OF_BIRTH_ISO8601
  }
}

const adminAvatarSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.AVATAR_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 1000
    },
    errorMessage: ADMIN_MESSAGE.AVATAR_LENGTH
  }
}

const adminAddressSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.ADDRESS_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 160
    },
    errorMessage: ADMIN_MESSAGE.ADDRESS_MUST_BE_FROM_6_TO_160
  }
}

const adminPhoneSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.PHONE_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 10,
      max: 20
    },
    errorMessage: ADMIN_MESSAGE.PHONE_LENGTH
  }
}

/* Declare functional schema */
export const adminRegisterValidator = validate(
  checkSchema(
    {
      secret_key_accept: {
        isString: {
          errorMessage: ADMIN_MESSAGE.SECRET_KEY_ACCEPT_ADMIN_REGITER_SITE_MUST_BE_STRING
        },
        trim: true,
        custom: {
          options: (value: string) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: ADMIN_MESSAGE.SECRET_KEY_ACCEPT_ADMIN_REGITER_SITE_REQUIRED,
                status: STATUS_CODE.BAD_REQUEST
              })
            }
            if (value !== CONFIG_ENV.SECRET_KEY_ACCEPT_ADMIN_REGITER_SITE) {
              throw new ErrorWithStatus({
                message: ADMIN_MESSAGE.SECRET_KEY_ACCEPT_ADMIN_REGITER_SITE_INVALID,
                status: STATUS_CODE.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      email: {
        ...adminEmailSchema,
        custom: {
          options: async (value: string) => {
            const admin = await adminUsersService.checkEmailAdminExisted(value)
            if (admin) {
              throw new ErrorWithStatus({
                message: ADMIN_MESSAGE.EMAIL_ALREADY_EXISTS,
                status: STATUS_CODE.CONFLICT
              })
            }
            return true
          }
        }
      },
      password: adminPasswordSchema,
      confirm_password: {
        ...adminConfirmPasswordSchema,
        custom: {
          options: (value: string, { req }) => {
            if (value !== req.body.password) {
              throw new Error(ADMIN_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const adminVerifyEmailValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        isString: true,
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: ADMIN_MESSAGE.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                status: STATUS_CODE.UNAUTHORIZED
              })
            }

            try {
              const admin_decode_email_verify_token = await verifyAdminToken({
                token: value,
                secretOrPublicKey: CONFIG_ENV.JWT_ADMIN_EMAIL_VERIFY_TOKEN_SECRET_KEY
              })
              const { user_id } = admin_decode_email_verify_token
              const admin = await databasesService.admins.findOne({ _id: new ObjectId(user_id) })
              if (admin === null) {
                throw new ErrorWithStatus({
                  message: ADMIN_MESSAGE.USER_NOT_FOUND,
                  status: STATUS_CODE.NOT_FOUND
                })
              }
              if (admin.email_verify_token === '') {
                throw new ErrorWithStatus({
                  message: ADMIN_MESSAGE.ACCOUNT_IS_VERIFIED,
                  status: STATUS_CODE.CONFLICT
                })
              }
              ;(req as Request).admin_decode_email_verify_token = admin_decode_email_verify_token
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

export const adminAccessTokenValidator = validate(
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
                  message: ADMIN_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
                  status: STATUS_CODE.UNAUTHORIZED
                })
              }
              const admin_decode_authorization = await verifyAdminToken({
                token: access_token,
                secretOrPublicKey: CONFIG_ENV.JWT_ADMIN_ACCESS_TOKEN_SECRET_KEY
              })
              ;(req as Request).admin_decode_authorization = admin_decode_authorization
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

export const adminRefreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: ADMIN_MESSAGE.REFRESH_TOKEN_IS_REQUIRED,
                status: STATUS_CODE.UNAUTHORIZED
              })
            }
            try {
              const [admin_decode_refresh_token, refresh_token] = await Promise.all([
                verifyAdminToken({
                  token: value,
                  secretOrPublicKey: CONFIG_ENV.JWT_ADMIN_REFRESH_TOKEN_SECRET_KEY
                }),
                databasesService.refreshTokens.findOne({ token: value })
              ])

              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: ADMIN_MESSAGE.REFRESH_TOKEN_NOT_FOUND,
                  status: STATUS_CODE.NOT_FOUND
                })
              }
              ;(req as Request).admin_decode_refresh_token = admin_decode_refresh_token
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

export const adminResendVerifyEmailValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.admin_decode_authorization as AdminTokenPayLoad
  const admin = await databasesService.admins.findOne({ _id: new ObjectId(user_id) })
  if (!admin) {
    return next(
      new ErrorWithStatus({
        message: ADMIN_MESSAGE.USER_NOT_FOUND,
        status: STATUS_CODE.NOT_FOUND
      })
    )
  }
  if (admin.verify === VerifyStatusAccount.Verified) {
    return next(
      new ErrorWithStatus({
        message: ADMIN_MESSAGE.ACCOUNT_IS_VERIFIED,
        status: STATUS_CODE.CONFLICT
      })
    )
  }
  ;(req as Request).admin = admin
  next()
}

export const adminLoginValidator = validate(
  checkSchema(
    {
      email: {
        ...adminEmailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const admin = await databasesService.admins.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (admin === null) {
              throw new Error(ADMIN_MESSAGE.EMAIL_OR_PASSWORD_INCORRECT)
            }
            ;(req as Request).admin = admin
            return true
          }
        }
      },
      password: adminPasswordSchema
    },
    ['body']
  )
)

export const adminVerifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.admin_decode_authorization as AdminTokenPayLoad
  if (verify !== VerifyStatusAccount.Verified) {
    return next(
      new ErrorWithStatus({
        message: ADMIN_MESSAGE.ACCOUNT_UNVERIFIED,
        status: STATUS_CODE.FORBIDDEN
      })
    )
  }
  next()
}

export const adminChangePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        ...adminPasswordSchema,
        custom: {
          options: async (value: string, { req }) => {
            const { user_id } = (req as Request).admin_decode_authorization as AdminTokenPayLoad
            const admin = await databasesService.admins.findOne({ _id: new ObjectId(user_id) })
            if (!admin) {
              throw new ErrorWithStatus({
                message: ADMIN_MESSAGE.USER_NOT_FOUND,
                status: STATUS_CODE.NOT_FOUND
              })
            }
            if (admin.password !== hashPassword(value)) {
              throw new ErrorWithStatus({
                message: ADMIN_MESSAGE.OLD_PASSWORD_INCORRECT,
                status: STATUS_CODE.UNPROCESSABLE_ENTITY
              })
            }
            return true
          }
        }
      },
      password: adminPasswordSchema,
      confirm_password: {
        ...adminConfirmPasswordSchema,
        custom: {
          options: (value: string, { req }) => {
            if (value !== req.body.password) {
              throw new Error(ADMIN_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const adminForgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        ...adminEmailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const admin = await databasesService.admins.findOne({ email: value })
            if (!admin) {
              throw new ErrorWithStatus({
                message: ADMIN_MESSAGE.USER_NOT_FOUND,
                status: STATUS_CODE.NOT_FOUND
              })
            }
            ;(req as Request).admin = admin
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const adminResetPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: adminForgotPasswordTokenSchema,
      password: adminPasswordSchema,
      confirm_password: {
        ...adminConfirmPasswordSchema,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(ADMIN_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const adminUpdateMeValidator = validate(
  checkSchema(
    {
      name: {
        ...adminNameSchema,
        optional: true
      },
      date_of_birth: {
        ...adminDateOfBirthSchema,
        optional: true
      },
      avatar: {
        ...adminAvatarSchema,
        optional: true
      },
      address: {
        ...adminAddressSchema,
        optional: true
      },
      phone: {
        ...adminPhoneSchema,
        optional: true
      }
    },
    ['body']
  )
)
