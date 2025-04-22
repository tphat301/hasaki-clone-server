import { Router } from 'express'
import {
  adminChangePasswordController,
  adminForgotPasswordController,
  adminGetMeController,
  adminLoginController,
  adminLogoutController,
  adminRefreshTokenController,
  adminRegisterController,
  adminResendVerifyEmailController,
  adminResetPasswordController,
  adminUpdateMeController,
  adminUploadAvatarController,
  adminVerifyEmailTokenController
} from '~/controllers/admin/adminAuth.controllers'
import {
  adminAccessTokenValidator,
  adminChangePasswordValidator,
  adminForgotPasswordValidator,
  adminLoginValidator,
  adminRefreshTokenValidator,
  adminRegisterValidator,
  adminResendVerifyEmailValidator,
  adminResetPasswordValidator,
  adminUpdateMeValidator,
  adminVerifiedUserValidator,
  adminVerifyEmailValidator
} from '~/middlewares/admin/adminUsers.middlewares'
import { filterMiddleware } from '~/middlewares/commons.middlewares'
import { AdminUpdateMeRequestBody } from '~/models/requests/admin/AdminUser.requests'
import wrapRequestHandler from '~/utils/handler'

const authAdminRouter = Router()

/**
 * Description router: Register admin account
 * Method: POST
 * Request body: AdminRegisterRequestBody
 * */
authAdminRouter.post('/register', adminRegisterValidator, wrapRequestHandler(adminRegisterController))

/**
 * Description: Verify admin account for send email
 * Path: /verify-email
 * Method: POST
 * Request body: { email_verify_token: string }
 * */
authAdminRouter.post('/verify-email', adminVerifyEmailValidator, wrapRequestHandler(adminVerifyEmailTokenController))

/**
 * Description route: Resend email when user has not received email
 * Path: /resend-verify-email
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * */
authAdminRouter.post(
  '/resend-verify-email',
  adminAccessTokenValidator,
  adminResendVerifyEmailValidator,
  wrapRequestHandler(adminResendVerifyEmailController)
)

/**
 * Description: Login admin account
 * Path: /login
 * Method: POST
 * Request Body: { email: string, password: string }
 * */
authAdminRouter.post('/login', adminLoginValidator, wrapRequestHandler(adminLoginController))

/**
 * Description: Logout admin account
 * Path: /logout
 * Method: POST
 * Request Body: { refresh_token: string }
 * */
authAdminRouter.post('/logout', adminRefreshTokenValidator, wrapRequestHandler(adminLogoutController))

/**
 * Description: Change password admin account
 * Path: /change-password
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request Body: { old_password: string, password: string, confirm_password: string }
 */
authAdminRouter.post(
  '/change-password',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  adminChangePasswordValidator,
  wrapRequestHandler(adminChangePasswordController)
)

/**
 * Description: Forgot password admin account
 * Path: /forgot-password
 * Method: POST
 * Request Body: { email: string }
 * */
authAdminRouter.post(
  '/forgot-password',
  adminForgotPasswordValidator,
  wrapRequestHandler(adminForgotPasswordController)
)

/**
 * Description route: Reset password when user subform forgot password
 * Path: /reset-password
 * Method: POST
 * Request body: { forgot_password_token: string, password: string, confirm_password: string }
 * */
authAdminRouter.post('/reset-password', adminResetPasswordValidator, wrapRequestHandler(adminResetPasswordController))

/**
 * Description: Get profile admin account
 * Path: /me
 * Method: GET
 * Request header: { Authorization: Bearer <access_token> }
 * */
authAdminRouter.get('/me', adminAccessTokenValidator, wrapRequestHandler(adminGetMeController))

/**
 * Description: Update profile admin account
 * Path: /me
 * Method: PATCH
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: AdminUpdateMeRequestBody
 * */
authAdminRouter.patch(
  '/me',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  adminUpdateMeValidator,
  filterMiddleware<AdminUpdateMeRequestBody>(['address', 'date_of_birth', 'name', 'phone', 'avatar']),
  wrapRequestHandler(adminUpdateMeController)
)

/**
 * Description: Update avatar admin account
 * Path: /upload-avatar
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request form data: { image: string }
 * */
authAdminRouter.post(
  '/upload-avatar',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  wrapRequestHandler(adminUploadAvatarController)
)

/*
 * Description: Refresh token when access token is expired
 * Path: /refresh-token
 * Method: POST
 * Request Body: { refresh_token: string }
 */
authAdminRouter.post('/refresh-token', adminRefreshTokenValidator, wrapRequestHandler(adminRefreshTokenController))

export default authAdminRouter
