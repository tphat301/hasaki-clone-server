import { Query, ParamsDictionary } from 'express-serve-static-core'
import { Order, SortBy } from '~/constants/enum'

export interface ProductPagination extends Query {
  page?: string
  limit?: string
}

export interface ProductListRequestQuery extends ProductPagination {
  order?: Order
  sort_by?: SortBy
  category?: string
  exclude?: string
  rating_filter?: string
  price_max?: string
  price_min?: string
  name?: string
}

export interface ProductDetailRequestParams extends ParamsDictionary {
  product_id: string
}
