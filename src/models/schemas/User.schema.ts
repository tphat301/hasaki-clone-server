import { ObjectId } from 'mongodb'
import { VerifyStatusAccount } from '~/constants/enum'

interface UserConstructor {
  _id?: ObjectId
  email: string
  password: string
  name?: string
  email_verify_token?: string
  forgot_password_token?: string
  date_of_birth?: Date
  verify?: VerifyStatusAccount
  address?: string
  phone?: string
  avatar?: string
  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  email_verify_token: string
  forgot_password_token: string
  date_of_birth: Date
  verify: VerifyStatusAccount
  address: string
  phone: string
  avatar: string
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    email,
    password,
    name,
    email_verify_token,
    forgot_password_token,
    date_of_birth,
    verify,
    address,
    phone,
    avatar,
    created_at,
    updated_at
  }: UserConstructor) {
    const date = new Date()
    this._id = _id
    this.email = email
    this.password = password
    this.name = name || ''
    this.email_verify_token = email_verify_token || ''
    this.forgot_password_token = forgot_password_token || ''
    this.date_of_birth = date_of_birth || date
    this.verify = verify || VerifyStatusAccount.Unverified
    this.address = address || ''
    this.phone = phone || ''
    this.avatar = avatar || ''
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
