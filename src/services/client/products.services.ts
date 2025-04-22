import { CONFIG_PAGINATION } from '~/constants/config'
import { Order, SortBy } from '~/constants/enum'
import { ProductListRequestQuery } from '~/models/requests/client/Product.requests'
import databasesService from '../databases.services'
import { ObjectId } from 'mongodb'
import { ADMIN_MESSAGE } from '~/constants/message'

class ProductsService {
  async productList(payload: ProductListRequestQuery) {
    let conditions: any = {}
    const page = Number(payload?.page) || CONFIG_PAGINATION.PAGE
    const limit = Number(payload?.limit) || CONFIG_PAGINATION.LIMIT
    const order = payload?.order || Order.Desc
    const sort_by = payload?.sort_by || SortBy.CreatedAt
    const { category, price_max, price_min, name, exclude, rating_filter } = payload
    const sort: any = {}
    let orderValue = -1

    if (category) {
      conditions.category = new ObjectId(category)
    }
    if (exclude) {
      conditions._id = { $ne: new ObjectId(exclude) }
    }
    if (rating_filter) {
      conditions.rating = {}
      conditions.rating.$gte = Number(rating_filter)
    }
    if (price_min || price_max) {
      conditions.price = {}
      if (price_min) conditions.price.$gte = Number(price_min)
      if (price_max) conditions.price.$lte = Number(price_max)
    }

    if (name) {
      conditions.$text = { $search: name } // dùng text search
    }
    // Nếu đang dùng text search thì MongoDB ưu tiên sắp xếp theo độ khớp relevance
    if (order) orderValue = order === Order.Desc ? -1 : 1

    if (name) {
      sort.score = { $meta: 'textScore' }
    } else {
      sort[sort_by] = orderValue
    }

    const [products, total] = await Promise.all([
      databasesService.products
        .find(conditions, name ? { projection: { score: { $meta: 'textScore' } } } : {})
        .sort(sort)
        .skip(limit * (page - 1))
        .limit(limit)
        .toArray(),
      databasesService.products.countDocuments()
    ])

    return {
      message: ADMIN_MESSAGE.GET_PRODUCT_SUCCESSFULLY,
      data: {
        products,
        pagination: {
          page,
          limit,
          page_size: Math.ceil(total / limit)
        }
      }
    }
  }

  async productDetail(product_id: string) {
    const data = await databasesService.products.findOne({ _id: new ObjectId(product_id) })
    return {
      message: ADMIN_MESSAGE.GET_DETAIL_PRODUCT_SUCCESSFULLY,
      data
    }
  }
}

const productsService = new ProductsService()
export default productsService
