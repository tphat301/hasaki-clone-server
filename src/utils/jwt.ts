import { type SignOptions, sign, verify } from 'jsonwebtoken'
import { AdminTokenPayLoad } from '~/models/requests/admin/AdminUser.requests'
import { TokenPayLoad } from '~/models/requests/client/User.requests'

interface SignToken {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}

interface VerifyTokenType {
  token: string
  secretOrPublicKey: string
}

export function signToken({ payload, privateKey, options = { algorithm: 'HS256' } }: SignToken) {
  return new Promise<string>(function (resolve, reject) {
    sign(payload, privateKey, options, function (err, token) {
      if (err) {
        throw reject(err)
      }
      resolve(token as string)
    })
  })
}

export function verifyToken({ token, secretOrPublicKey }: VerifyTokenType) {
  return new Promise<TokenPayLoad>(function (resolve, reject) {
    verify(token, secretOrPublicKey, function (err, decoded) {
      if (err) {
        throw reject(err)
      }
      resolve(decoded as TokenPayLoad)
    })
  })
}

export const verifyAdminToken = ({ token, secretOrPublicKey }: VerifyTokenType) => {
  return new Promise<AdminTokenPayLoad>((resolve, reject) => {
    verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as AdminTokenPayLoad)
    })
  })
}
