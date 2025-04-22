import { Request } from 'express'
import { TokenPayLoad } from './models/requests/client/User.requests'
import User from './models/schemas/User.schema'
import { AdminTokenPayLoad } from './models/requests/admin/AdminUser.requests'
import Admin from './models/schemas/Admin.schema'
import Product from './models/schemas/Product.schema'

declare module 'express' {
  interface Request {
    user?: User
    admin?: Admin
    product?: Product
    decode_authorization?: TokenPayLoad
    decode_refresh_token?: TokenPayLoad
    decode_email_verify_token?: TokenPayLoad
    decode_forgot_password_token?: TokenPayLoad
    admin_decode_authorization?: AdminTokenPayLoad
    admin_decode_refresh_token?: AdminTokenPayLoad
    admin_decode_email_verify_token?: AdminTokenPayLoad
    admin_decode_forgot_password_token?: AdminTokenPayLoad
  }
}
