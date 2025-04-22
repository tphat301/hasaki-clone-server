import { JwtPayload } from 'jsonwebtoken'
import { TokenType, VerifyStatusAccount } from '~/constants/enum'

export interface AdminRegisterRequestBody {
  secret_key_accept: string
  email: string
  password: string
  confirm_password: string
}

export interface AdminLoginRequestBody {
  email: string
  password: string
}

export interface AdminLogoutRequestBody {
  refresh_token: string
}

export interface AdminChangePasswordRequestBody {
  old_password: string
  password: string
  confirm_password: string
}

export interface AdminTokenPayLoad extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: VerifyStatusAccount
  iat: number
  exp: number
}

export interface AdminForgotPasswordRequestBody {
  email: string
}

export interface AdminResetPasswordRequestBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export interface AdminUpdateMeRequestBody {
  name?: string
  address?: string
  phone?: string
  date_of_birth?: string
  avatar?: string
}

export interface AdminRefreshTokenRequestBody {
  refresh_token: string
}
