import { ObjectId } from 'mongodb'
import databasesService from '../databases.services'
import { StatusCart } from '~/constants/enum'
import Purchase from '~/models/schemas/Purchase.schema'
import { ADMIN_MESSAGE } from '~/constants/message'

class PurchasesService {
  async isProductInCart(product_id: string) {
    const cart = await databasesService.purchases.findOne({
      product_id: new ObjectId(product_id),
      status: StatusCart.UnActive
    })
    return Boolean(cart)
  }

  async addToCart({
    user_id,
    product_id,
    buy_count,
    isCartExist
  }: {
    user_id: string
    product_id: string
    buy_count: number
    isCartExist: boolean
  }) {
    if (!isCartExist) {
      const purchase = await databasesService.purchases.insertOne(
        new Purchase({
          user_id: new ObjectId(user_id),
          product_id: new ObjectId(product_id),
          buy_count: Number(buy_count),
          status: StatusCart.UnActive
        })
      )
      const result = await databasesService.purchases
        .aggregate([
          {
            $match: {
              _id: purchase.insertedId
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'users'
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: 'product_id',
              foreignField: '_id',
              as: 'products'
            }
          },
          {
            $unwind: {
              path: '$users'
            }
          },
          {
            $unwind: {
              path: '$products'
            }
          },
          {
            $addFields: {
              user: {
                _id: '$users._id',
                email: '$users.email',
                name: '$users.name',
                date_of_birth: '$users.date_of_birth',
                address: '$users.address',
                phone: '$users.phone',
                avatar: '$users.avatar',
                created_at: '$users.created_at',
                updated_at: '$users.updated_at'
              },
              product: {
                _id: '$products._id',
                category: '$products.category',
                image: '$products.image',
                images: '$products.images',
                slug: '$products.slug',
                name: '$products.name',
                price: '$products.price',
                price_before_discount: '$products.price_before_discount',
                quantity: '$products.quantity',
                sold: '$products.sold',
                view: '$products.view',
                rating: '$products.rating',
                description: '$products.description',
                seo_title: '$products.seo_title',
                seo_keywords: '$products.seo_keywords',
                seo_description: '$products.seo_description',
                created_at: '$products.created_at',
                updated_at: '$products.updated_at'
              }
            }
          },
          {
            $project: {
              products: 0,
              users: 0,
              user_id: 0,
              product_id: 0
            }
          }
        ])
        .toArray()
      return {
        message: ADMIN_MESSAGE.ADD_TO_CART_SUCCESSFULLY,
        data: result[0]
      }
    } else {
      const purchase = await databasesService.purchases.findOneAndUpdate(
        { product_id: new ObjectId(product_id) },
        {
          $inc: {
            buy_count: Number(buy_count)
          },
          $currentDate: { updated_at: true }
        },
        {
          returnDocument: 'after'
        }
      )

      const result = await databasesService.purchases
        .aggregate([
          {
            $match: {
              _id: new ObjectId(purchase?._id)
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'users'
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: 'product_id',
              foreignField: '_id',
              as: 'products'
            }
          },
          {
            $unwind: {
              path: '$users'
            }
          },
          {
            $unwind: {
              path: '$products'
            }
          },
          {
            $addFields: {
              user: {
                _id: '$users._id',
                email: '$users.email',
                name: '$users.name',
                date_of_birth: '$users.date_of_birth',
                address: '$users.address',
                phone: '$users.phone',
                avatar: '$users.avatar',
                created_at: '$users.created_at',
                updated_at: '$users.updated_at'
              },
              product: {
                _id: '$products._id',
                category: '$products.category',
                image: '$products.image',
                images: '$products.images',
                slug: '$products.slug',
                name: '$products.name',
                price: '$products.price',
                price_before_discount: '$products.price_before_discount',
                quantity: '$products.quantity',
                sold: '$products.sold',
                view: '$products.view',
                rating: '$products.rating',
                description: '$products.description',
                seo_title: '$products.seo_title',
                seo_keywords: '$products.seo_keywords',
                seo_description: '$products.seo_description',
                created_at: '$products.created_at',
                updated_at: '$products.updated_at'
              }
            }
          },
          {
            $project: {
              products: 0,
              users: 0,
              user_id: 0,
              product_id: 0
            }
          }
        ])
        .toArray()

      return {
        message: ADMIN_MESSAGE.ADD_TO_CART_SUCCESSFULLY,
        data: result[0]
      }
    }
  }

  async updateCart({ product_id, buy_count }: { product_id: string; buy_count: number }) {
    const purchase = await databasesService.purchases.findOneAndUpdate(
      { product_id: new ObjectId(product_id) },
      {
        $set: {
          buy_count: Number(buy_count)
        },
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after'
      }
    )

    const result = await databasesService.purchases
      .aggregate([
        {
          $match: {
            _id: new ObjectId(purchase?._id)
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'users'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'products'
          }
        },
        {
          $unwind: {
            path: '$users'
          }
        },
        {
          $unwind: {
            path: '$products'
          }
        },
        {
          $addFields: {
            user: {
              _id: '$users._id',
              email: '$users.email',
              name: '$users.name',
              date_of_birth: '$users.date_of_birth',
              address: '$users.address',
              phone: '$users.phone',
              avatar: '$users.avatar',
              created_at: '$users.created_at',
              updated_at: '$users.updated_at'
            },
            product: {
              _id: '$products._id',
              category: '$products.category',
              image: '$products.image',
              images: '$products.images',
              slug: '$products.slug',
              name: '$products.name',
              price: '$products.price',
              price_before_discount: '$products.price_before_discount',
              quantity: '$products.quantity',
              sold: '$products.sold',
              view: '$products.view',
              rating: '$products.rating',
              description: '$products.description',
              seo_title: '$products.seo_title',
              seo_keywords: '$products.seo_keywords',
              seo_description: '$products.seo_description',
              created_at: '$products.created_at',
              updated_at: '$products.updated_at'
            }
          }
        },
        {
          $project: {
            products: 0,
            users: 0,
            user_id: 0,
            product_id: 0
          }
        }
      ])
      .toArray()

    return result[0]
  }

  async readCart(status: StatusCart) {
    const result = await databasesService.purchases
      .aggregate([
        {
          $match: {
            status
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'users'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'products'
          }
        },
        {
          $unwind: {
            path: '$users'
          }
        },
        {
          $unwind: {
            path: '$products'
          }
        },
        {
          $addFields: {
            user: {
              _id: '$users._id',
              email: '$users.email',
              name: '$users.name',
              date_of_birth: '$users.date_of_birth',
              address: '$users.address',
              phone: '$users.phone',
              avatar: '$users.avatar',
              created_at: '$users.created_at',
              updated_at: '$users.updated_at'
            },
            product: {
              _id: '$products._id',
              category: '$products.category',
              image: '$products.image',
              images: '$products.images',
              slug: '$products.slug',
              name: '$products.name',
              price: '$products.price',
              price_before_discount: '$products.price_before_discount',
              quantity: '$products.quantity',
              sold: '$products.sold',
              view: '$products.view',
              rating: '$products.rating',
              description: '$products.description',
              seo_title: '$products.seo_title',
              seo_keywords: '$products.seo_keywords',
              seo_description: '$products.seo_description',
              created_at: '$products.created_at',
              updated_at: '$products.updated_at'
            }
          }
        },
        {
          $project: {
            products: 0,
            users: 0,
            user_id: 0,
            product_id: 0
          }
        }
      ])
      .toArray()

    return result
  }

  async deleteCart(puschase_ids: string[]) {
    const purchaseIdsObject = puschase_ids.map((item) => new ObjectId(item))
    await databasesService.purchases.deleteMany({
      _id: {
        $in: purchaseIdsObject
      },
      status: StatusCart.UnActive
    })
    return {
      message: ADMIN_MESSAGE.DETELE_CART_SUCCESSFULLY
    }
  }

  async buyProducts(payload: { product_id: string; buy_count: number }[]) {
    const result = await Promise.all(
      payload.map((item) => {
        return databasesService.purchases.findOneAndUpdate(
          {
            product_id: new ObjectId(item.product_id),
            status: StatusCart.UnActive
          },
          {
            $set: {
              status: StatusCart.Active
            }
          },
          {
            returnDocument: 'after'
          }
        )
      })
    )
    const purchaseIds = result.map((item) => item?._id)
    const data = await databasesService.purchases
      .aggregate([
        {
          $match: {
            _id: {
              $in: purchaseIds
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'users'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'products'
          }
        },
        {
          $unwind: {
            path: '$users'
          }
        },
        {
          $unwind: {
            path: '$products'
          }
        },
        {
          $addFields: {
            user: {
              _id: '$users._id',
              email: '$users.email',
              name: '$users.name',
              date_of_birth: '$users.date_of_birth',
              address: '$users.address',
              phone: '$users.phone',
              avatar: '$users.avatar',
              created_at: '$users.created_at',
              updated_at: '$users.updated_at'
            },
            product: {
              _id: '$products._id',
              category: '$products.category',
              image: '$products.image',
              images: '$products.images',
              slug: '$products.slug',
              name: '$products.name',
              price: '$products.price',
              price_before_discount: '$products.price_before_discount',
              quantity: '$products.quantity',
              sold: '$products.sold',
              view: '$products.view',
              rating: '$products.rating',
              description: '$products.description',
              seo_title: '$products.seo_title',
              seo_keywords: '$products.seo_keywords',
              seo_description: '$products.seo_description',
              created_at: '$products.created_at',
              updated_at: '$products.updated_at'
            }
          }
        },
        {
          $project: {
            products: 0,
            users: 0,
            user_id: 0,
            product_id: 0
          }
        }
      ])
      .toArray()

    return {
      message: ADMIN_MESSAGE.BUY_PRODUCTS_SUCCESSFULLY,
      data
    }
  }
}

const purchasesService = new PurchasesService()
export default purchasesService
