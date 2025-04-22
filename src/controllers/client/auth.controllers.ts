import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { CLIENT_MESSAGE } from '~/constants/message'
import STATUS_CODE from '~/constants/statusCode'
import {
  ChangePasswordRequestBody,
  ForgotPasswordRequestBody,
  LoginRequestBody,
  LogoutRequestBody,
  RefreshTokenRequestBody,
  RegisterRequestBody,
  ResetPasswordRequestBody,
  TokenPayLoad,
  UpdateMeRequestBody
} from '~/models/requests/client/User.requests'
import User from '~/models/schemas/User.schema'
import usersService from '~/services/client/users.services'
import mediasService from '~/services/medias.services'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const payload = req.body
  const result = await usersService.register(payload)
  res.status(STATUS_CODE.CREATED).json({
    message: CLIENT_MESSAGE.REGISTER_SUCCESSFULLY,
    data: result
  })
  return
}

export const verifyEmailTokenController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user_id } = req.decode_email_verify_token as TokenPayLoad
  const result = await usersService.verifyEmailToken(user_id)
  res.json(result)
  return
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const user = req.user as User
  const { email } = user
  const result = await usersService.resendVerifyEmail({ email, user_id })
  res.json(result)
  return
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const verify = user.verify
  const result = await usersService.login({ user_id: user_id.toString(), verify })
  res.json({
    message: CLIENT_MESSAGE.LOGIN_SUCCESSFULLY,
    data: result
  })
  return
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  res.json(result)
  return
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const { password } = req.body
  const result = await usersService.changePassword({ user_id, password })
  res.json(result)
  return
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response
) => {
  const { email, verify, _id } = req.user as User
  const result = await usersService.forgotPassword({ email, verify, user_id: (_id as ObjectId).toString() })
  res.json(result)
  return
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_forgot_password_token as TokenPayLoad
  const { password } = req.body
  const result = await usersService.resetPassword({ user_id, password })
  res.json(result)
  return
}

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const result = await usersService.getMe(user_id)
  res.json({
    message: CLIENT_MESSAGE.GET_ME_SUCCESSFULLY,
    data: result
  })
  return
}

export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeRequestBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const payload = req.body
  const result = await usersService.updateMe({ user_id, payload })
  res.json({
    message: CLIENT_MESSAGE.UPDATE_ME_SUCCESSFULLY,
    data: result
  })
  return
}

export const uploadAvatarController = async (req: Request, res: Response) => {
  const result = await mediasService.handleUploadStaticImage(req)
  res.json({
    message: CLIENT_MESSAGE.UPLOAD_AVATAR_SUCCESSFULLY,
    data: result
  })
  return
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenRequestBody>,
  res: Response
) => {
  const { user_id, verify, exp } = req.decode_refresh_token as TokenPayLoad
  const { refresh_token } = req.body
  const result = await usersService.refreshToken({ user_id, verify, exp, refresh_token })
  res.json({
    message: CLIENT_MESSAGE.REFRESH_TOKEN_SUCCESSFULLY,
    data: result
  })
  return
}
