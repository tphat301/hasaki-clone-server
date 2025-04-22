import { createHash } from 'crypto'
import { CONFIG_ENV } from '~/constants/config'

function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

function hashPassword(password: string) {
  return sha256(password + CONFIG_ENV.PASSWORD_SECRET_KEY)
}

export default hashPassword
