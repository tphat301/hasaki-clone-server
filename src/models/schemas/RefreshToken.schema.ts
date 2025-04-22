import { ObjectId } from 'mongodb'

interface RefreshTokenConstructorType {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  iat: number
  exp: number
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  iat: Date
  exp: Date
  constructor({ _id, token, user_id, iat, exp }: RefreshTokenConstructorType) {
    this._id = _id
    this.token = token
    this.user_id = user_id
    this.iat = new Date(iat * 1000)
    this.exp = new Date(exp * 1000) // Covert epoch time to date
  }
}
