import { JwtPayload } from 'jsonwebtoken'
import { TokenType, VerifyStatusAccount } from '~/constants/enum'

export interface RegisterRequestBody {
  email: string
  password: string
  confirm_password: string
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface ChangePasswordRequestBody {
  old_password: string
  password: string
  confirm_password: string
}

export interface TokenPayLoad extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: VerifyStatusAccount
  iat: number
  exp: number
}

export interface ForgotPasswordRequestBody {
  email: string
}

export interface ResetPasswordRequestBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export interface UpdateMeRequestBody {
  name?: string
  address?: string
  phone?: string
  date_of_birth?: string
  avatar?: string
}

export interface RefreshTokenRequestBody {
  refresh_token: string
}
