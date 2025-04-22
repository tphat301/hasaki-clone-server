import { ObjectId } from 'mongodb'
import { StatusCart } from '~/constants/enum'

interface PurchaseConstructor {
  _id?: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  buy_count: number
  status: StatusCart
  created_at?: Date
  updated_at?: Date
}

class Purchase {
  _id?: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  buy_count: number
  status: StatusCart
  created_at: Date
  updated_at: Date
  constructor({ _id, buy_count, product_id, status, user_id, created_at, updated_at }: PurchaseConstructor) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.product_id = product_id
    this.buy_count = buy_count
    this.status = status
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}

export default Purchase
