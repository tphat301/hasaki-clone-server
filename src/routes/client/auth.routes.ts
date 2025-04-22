import { Router } from 'express'
import {
  changePasswordController,
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updateMeController,
  uploadAvatarController,
  verifyEmailTokenController
} from '~/controllers/client/auth.controllers'
import {
  accessTokenValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resendVerifyEmailValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyEmailValidator
} from '~/middlewares/client/users.middlewares'
import { filterMiddleware } from '~/middlewares/commons.middlewares'
import { UpdateMeRequestBody } from '~/models/requests/client/User.requests'
import wrapRequestHandler from '~/utils/handler'

const authClientRouter = Router()

/**
 * Description router: Register user account
 * Method: POST
 * Request body: RegisterRequestBody
 * */
authClientRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Verify user account for send email
 * Path: /verify-email
 * Method: POST
 * Request body: { email_verify_token: string }
 * */
authClientRouter.post('/verify-email', verifyEmailValidator, wrapRequestHandler(verifyEmailTokenController))

/**
 * Description route: Resend email when user has not received email
 * Path: /resend-verify-email
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * */
authClientRouter.post(
  '/resend-verify-email',
  accessTokenValidator,
  resendVerifyEmailValidator,
  wrapRequestHandler(resendVerifyEmailController)
)

/**
 * Description: Login user account
 * Path: /login
 * Method: POST
 * Request Body: { email: string, password: string }
 * */
authClientRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Logout user account
 * Path: /logout
 * Method: POST
 * Request Body: { refresh_token: string }
 * */
authClientRouter.post('/logout', refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Change password user account
 * Path: /change-password
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request Body: { old_password: string,password: string, confirm_password: string }
 */
authClientRouter.post(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

/**
 * Description: Forgot password user account
 * Path: /forgot-password
 * Method: POST
 * Request Body: { email: string }
 * */
authClientRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description route: Reset password when user subform forgot password
 * Path: /reset-password
 * Method: POST
 * Request body: { forgot_password_token: string, password: string, confirm_password: string }
 * */
authClientRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: Get profile user account
 * Path: /me
 * Method: GET
 * Request header: { Authorization: Bearer <access_token> }
 * */
authClientRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update profile user account
 * Path: /me
 * Method: PATCH
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: UpdateMeRequestBody
 * */
authClientRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeRequestBody>(['address', 'date_of_birth', 'name', 'phone', 'avatar']),
  wrapRequestHandler(updateMeController)
)

/**
 * Description: Update avatar user account
 * Path: /upload-avatar
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request form data: { image: string }
 * */
authClientRouter.post(
  '/upload-avatar',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadAvatarController)
)

/*
 * Description: Refresh token when access token is expired
 * Path: /refresh-token
 * Method: POST
 * Request Body: { refresh_token: string }
 */
authClientRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

export default authClientRouter
