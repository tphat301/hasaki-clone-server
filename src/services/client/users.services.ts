import { TokenType, VerifyStatusAccount } from '~/constants/enum'
import databasesService from '../databases.services'
import { signToken, verifyToken } from '~/utils/jwt'
import { CONFIG_ENV } from '~/constants/config'
import { RegisterRequestBody, UpdateMeRequestBody } from '~/models/requests/client/User.requests'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'
import hashPassword from '~/utils/crypto'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { forgotPasswordSendMail, verifySendMail } from '~/utils/mailer'
import { CLIENT_MESSAGE } from '~/constants/message'
import { convertToSeconds } from '~/utils/commons'

class UsersService {
  async checkEmailExisted(email: string) {
    const user = await databasesService.users.findOne({ email })
    return Boolean(user)
  }

  private signAccessToken({ user_id, verify }: { user_id: string; verify: VerifyStatusAccount }) {
    return signToken({
      payload: {
        user_id,
        verify,
        token_type: TokenType.AccessToken
      },
      privateKey: CONFIG_ENV.JWT_ACCESS_TOKEN_SECRET_KEY,
      options: {
        expiresIn: CONFIG_ENV.JWT_ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken({ user_id, verify, exp }: { user_id: string; verify: VerifyStatusAccount; exp?: number }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          verify,
          token_type: TokenType.RefreshToken,
          exp
        },
        privateKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY
      })
    }
    return signToken({
      payload: {
        user_id,
        verify,
        token_type: TokenType.RefreshToken
      },
      privateKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY,
      options: {
        expiresIn: CONFIG_ENV.JWT_REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: VerifyStatusAccount }) {
    return signToken({
      payload: {
        user_id,
        verify,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: CONFIG_ENV.JWT_EMAIL_VERIFY_TOKEN_SECRET_KEY,
      options: {
        expiresIn: CONFIG_ENV.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: VerifyStatusAccount }) {
    return signToken({
      payload: {
        user_id,
        verify,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: CONFIG_ENV.JWT_FORGOT_PASSWORD_TOKEN_SECRET_KEY,
      options: {
        expiresIn: CONFIG_ENV.JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({ token: refresh_token, secretOrPublicKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY })
  }

  private signAccessTokenAndRefreshToken({ user_id, verify }: { user_id: string; verify: VerifyStatusAccount }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  async register(payload: Pick<RegisterRequestBody, 'email' | 'password'>) {
    const user_id = new ObjectId()
    const { email, password } = payload
    const [tokens, email_verify_token] = await Promise.all([
      this.signAccessTokenAndRefreshToken({ user_id: user_id.toString(), verify: VerifyStatusAccount.Unverified }),
      this.signEmailVerifyToken({ user_id: user_id.toString(), verify: VerifyStatusAccount.Unverified })
    ])
    const [access_token, refresh_token] = tokens
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    const [user] = await Promise.all([
      databasesService.users.insertOne(
        new User({
          _id: user_id,
          email,
          password: hashPassword(password),
          email_verify_token
        })
      ),
      databasesService.refreshTokens.insertOne(
        new RefreshToken({
          token: refresh_token,
          iat,
          exp,
          user_id
        })
      ),
      verifySendMail({ email, subject: `Verify your email`, token: email_verify_token })
    ])
    const result = await databasesService.users.findOne(
      { _id: user.insertedId },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    const expires_access_token = convertToSeconds(CONFIG_ENV.JWT_ACCESS_TOKEN_EXPIRES_IN)
    const expires_refresh_token = convertToSeconds(CONFIG_ENV.JWT_REFRESH_TOKEN_EXPIRES_IN)
    return {
      access_token,
      refresh_token,
      expires_access_token,
      expires_refresh_token,
      user: result
    }
  }

  async verifyEmailToken(user_id: string) {
    await databasesService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          verify: VerifyStatusAccount.Verified,
          email_verify_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: CLIENT_MESSAGE.VERIFY_ACCOUNT_SUCCESSFULLY
    }
  }

  async resendVerifyEmail({ email, user_id }: { email: string; user_id: string }) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: VerifyStatusAccount.Unverified })

    await Promise.all([
      databasesService.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        [
          {
            $set: {
              email_verify_token,
              updated_at: '$$NOW'
            }
          }
        ]
      ),
      verifySendMail({ email, subject: `Email xác thực tài khoản người dùng`, token: email_verify_token })
    ])

    return {
      message: CLIENT_MESSAGE.RESEND_VERIFY_EMAIL_SUCCESSFULLY
    }
  }

  async login({ user_id, verify }: { user_id: string; verify: VerifyStatusAccount }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({ user_id, verify })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    const [user] = await Promise.all([
      databasesService.users.findOne(
        { _id: new ObjectId(user_id) },
        {
          projection: {
            password: 0,
            email_verify_token: 0,
            forgot_password_token: 0
          }
        }
      ),
      databasesService.refreshTokens.insertOne(
        new RefreshToken({
          user_id: new ObjectId(user_id),
          token: refresh_token,
          iat,
          exp
        })
      )
    ])
    const expires_access_token = convertToSeconds(CONFIG_ENV.JWT_ACCESS_TOKEN_EXPIRES_IN)
    const expires_refresh_token = convertToSeconds(CONFIG_ENV.JWT_REFRESH_TOKEN_EXPIRES_IN)
    return {
      access_token,
      refresh_token,
      expires_access_token,
      expires_refresh_token,
      user
    }
  }

  async logout(refresh_token: string) {
    await databasesService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: CLIENT_MESSAGE.LOGOUT_SUCCESSFULLY
    }
  }

  async changePassword({ user_id, password }: { user_id: string; password: string }) {
    await databasesService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: hashPassword(password)
        },
        $currentDate: { updated_at: true }
      }
    )
    return {
      message: CLIENT_MESSAGE.CHANGE_PASSWORD_SUCCESSFULLY
    }
  }

  async forgotPassword({ email, user_id, verify }: { email: string; user_id: string; verify: VerifyStatusAccount }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
    await Promise.all([
      databasesService.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            forgot_password_token
          },
          $currentDate: { updated_at: true }
        }
      ),
      forgotPasswordSendMail({ email, subject: `Email xác minh lấy lại mật khẩu`, token: forgot_password_token })
    ])

    return {
      message: CLIENT_MESSAGE.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword({ user_id, password }: { user_id: string; password: string }) {
    await databasesService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password)
        },
        $currentDate: { updated_at: true }
      }
    )
    return {
      message: CLIENT_MESSAGE.RESET_PASSWORD_SUCCESSFULLY
    }
  }

  async updateMe({ user_id, payload }: { user_id: string; payload: UpdateMeRequestBody }) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const result = await databasesService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(_payload as UpdateMeRequestBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        },
        returnDocument: 'after'
      }
    )
    return result
  }

  async getMe(user_id: string) {
    const user = await databasesService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async refreshToken({
    user_id,
    verify,
    refresh_token,
    exp
  }: {
    user_id: string
    verify: VerifyStatusAccount
    refresh_token: string
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify, exp }),
      databasesService.refreshTokens.deleteOne({ token: refresh_token })
    ])
    const decode_refresh_token = await this.decodeRefreshToken(new_refresh_token)
    const [user] = await Promise.all([
      await databasesService.users.findOne(
        { _id: new ObjectId(user_id) },
        {
          projection: {
            password: 0,
            email_verify_token: 0,
            forgot_password_token: 0
          }
        }
      ),
      await databasesService.refreshTokens.insertOne(
        new RefreshToken({
          user_id: new ObjectId(user_id),
          token: new_refresh_token,
          iat: decode_refresh_token.iat,
          exp: decode_refresh_token.exp
        })
      )
    ])

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token,
      user
    }
  }
}

const usersService = new UsersService()
export default usersService
