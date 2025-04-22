import { Query } from 'express-serve-static-core'
import { StatusCart } from '~/constants/enum'

export interface AddToCartRequestBody {
  product_id: string
  buy_count: number
}

export interface ReadCartRequestQuery extends Query {
  status: StatusCart
}

export interface DeleteCartRquestBody {
  puschase_ids: string[]
}

export interface UpdateCartRequestBody {
  product_id: string
  buy_count: number
}

export interface BuyCartRequestBody {
  body_cart: {
    product_id: string
    buy_count: number
  }[]
}
