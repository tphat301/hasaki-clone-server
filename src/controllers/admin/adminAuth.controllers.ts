import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { ADMIN_MESSAGE } from '~/constants/message'
import STATUS_CODE from '~/constants/statusCode'
import {
  AdminChangePasswordRequestBody,
  AdminForgotPasswordRequestBody,
  AdminLoginRequestBody,
  AdminLogoutRequestBody,
  AdminRefreshTokenRequestBody,
  AdminRegisterRequestBody,
  AdminResetPasswordRequestBody,
  AdminTokenPayLoad,
  AdminUpdateMeRequestBody
} from '~/models/requests/admin/AdminUser.requests'
import Admin from '~/models/schemas/Admin.schema'
import adminUsersService from '~/services/admin/adminUsers.services'
import mediasService from '~/services/medias.services'

export const adminRegisterController = async (
  req: Request<ParamsDictionary, any, AdminRegisterRequestBody>,
  res: Response
) => {
  const payload = req.body
  const result = await adminUsersService.register(payload)
  res.status(STATUS_CODE.CREATED).json({
    message: ADMIN_MESSAGE.REGISTER_SUCCESSFULLY,
    data: result
  })
  return
}

export const adminVerifyEmailTokenController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user_id } = req.admin_decode_email_verify_token as AdminTokenPayLoad
  const result = await adminUsersService.verifyEmailToken(user_id)
  res.json(result)
  return
}

export const adminResendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.admin_decode_authorization as AdminTokenPayLoad
  const admin = req.admin as Admin
  const { email } = admin
  const result = await adminUsersService.resendVerifyEmail({ email, user_id })
  res.json(result)
  return
}

export const adminLoginController = async (
  req: Request<ParamsDictionary, any, AdminLoginRequestBody>,
  res: Response
) => {
  const admin = req.admin as Admin
  const user_id = admin._id as ObjectId
  const verify = admin.verify
  const result = await adminUsersService.login({ user_id: user_id.toString(), verify })
  res.json({
    message: ADMIN_MESSAGE.LOGIN_SUCCESSFULLY,
    data: result
  })
  return
}

export const adminLogoutController = async (
  req: Request<ParamsDictionary, any, AdminLogoutRequestBody>,
  res: Response
) => {
  const { refresh_token } = req.body
  const result = await adminUsersService.logout(refresh_token)
  res.json(result)
  return
}

export const adminChangePasswordController = async (
  req: Request<ParamsDictionary, any, AdminChangePasswordRequestBody>,
  res: Response
) => {
  const { user_id } = req.admin_decode_authorization as AdminTokenPayLoad
  const { password } = req.body
  const result = await adminUsersService.changePassword({ user_id, password })
  res.json(result)
  return
}

export const adminForgotPasswordController = async (
  req: Request<ParamsDictionary, any, AdminForgotPasswordRequestBody>,
  res: Response
) => {
  const { email, verify, _id } = req.admin as Admin
  const result = await adminUsersService.forgotPassword({ email, verify, user_id: (_id as ObjectId).toString() })
  res.json(result)
  return
}

export const adminResetPasswordController = async (
  req: Request<ParamsDictionary, any, AdminResetPasswordRequestBody>,
  res: Response
) => {
  const { user_id } = req.admin_decode_forgot_password_token as AdminTokenPayLoad
  const { password } = req.body
  const result = await adminUsersService.resetPassword({ user_id, password })
  res.json(result)
  return
}

export const adminGetMeController = async (req: Request, res: Response) => {
  const { user_id } = req.admin_decode_authorization as AdminTokenPayLoad
  const result = await adminUsersService.getMe(user_id)
  res.json({
    message: ADMIN_MESSAGE.GET_ME_SUCCESSFULLY,
    data: result
  })
  return
}

export const adminUpdateMeController = async (
  req: Request<ParamsDictionary, any, AdminUpdateMeRequestBody>,
  res: Response
) => {
  const { user_id } = req.admin_decode_authorization as AdminTokenPayLoad
  const payload = req.body
  const result = await adminUsersService.updateMe({ user_id, payload })
  res.json({
    message: ADMIN_MESSAGE.UPDATE_ME_SUCCESSFULLY,
    data: result
  })
  return
}

export const adminUploadAvatarController = async (req: Request, res: Response) => {
  const result = await mediasService.handleUploadStaticImage(req)
  res.json({
    message: ADMIN_MESSAGE.UPLOAD_AVATAR_SUCCESSFULLY,
    data: result
  })
  return
}

export const adminRefreshTokenController = async (
  req: Request<ParamsDictionary, any, AdminRefreshTokenRequestBody>,
  res: Response
) => {
  const { user_id, verify, exp } = req.admin_decode_refresh_token as AdminTokenPayLoad
  const { refresh_token } = req.body
  const result = await adminUsersService.refreshToken({ user_id, verify, exp, refresh_token })
  res.json({
    message: ADMIN_MESSAGE.REFRESH_TOKEN_SUCCESSFULLY,
    data: result
  })
  return
}
