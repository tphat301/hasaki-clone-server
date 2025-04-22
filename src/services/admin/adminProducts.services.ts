import {
  CreateAdminProductRequestBody,
  UpdateAdminProductRequestBody
} from '~/models/requests/admin/AdminProduct.requests'
import databasesService from '../databases.services'
import { ADMIN_MESSAGE } from '~/constants/message'
import Product from '~/models/schemas/Product.schema'
import { ObjectId } from 'mongodb'
import { omit } from 'lodash'

class AdminProductsService {
  async checkSlugExist(slug: string) {
    const product = await databasesService.products.findOne({ slug })
    return Boolean(product)
  }

  async isProduct(product_id: string) {
    const product = await databasesService.products.findOne({ _id: new ObjectId(product_id) })
    return Boolean(product)
  }

  async create(payload: CreateAdminProductRequestBody) {
    let categoryPayload
    if (payload.category) {
      categoryPayload = new ObjectId(payload.category)
    } else {
      categoryPayload = null
    }
    await databasesService.products.insertOne(
      new Product({
        slug: payload.slug,
        name: payload.name,
        price: Number(payload.price),
        price_before_discount: Number(payload.price_before_discount),
        quantity: Number(payload.quantity),
        rating: Number(payload.rating),
        sold: Number(payload.sold),
        view: Number(payload.view),
        category: categoryPayload,
        image: payload.image,
        images: payload.images,
        description: payload.description,
        seo_title: payload.seo_title,
        seo_keywords: payload.seo_keywords,
        seo_description: payload.seo_description
      })
    )

    return {
      message: ADMIN_MESSAGE.CREATED_PRODUCT_SUCCESSFULLY
    }
  }

  async update(payload: UpdateAdminProductRequestBody) {
    const datas = omit(payload, ['product_id', 'updated_at'])
    for (const key in datas) {
      const typedKey = key as keyof typeof datas
      const value = datas[typedKey]
      if (value === undefined) {
        delete datas[typedKey]
        continue
      }
      if (key === 'category') {
        let categoryValue
        if (value) {
          categoryValue = new ObjectId(value as string)
        } else {
          categoryValue = null
        }
        datas[typedKey] = categoryValue as any
      }
    }

    const result = await databasesService.products.findOneAndUpdate(
      {
        _id: new ObjectId(payload.product_id)
      },
      {
        $set: { ...(datas as Record<string, any>) },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return result
  }

  async read({ page, limit }: { page: number; limit: number }) {
    const [products, total] = await Promise.all([
      databasesService.products
        .aggregate([
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databasesService.products.countDocuments()
    ])
    return {
      products,
      total
    }
  }

  async readDetail(product_id: string) {
    const result = await databasesService.products.findOne({
      _id: new ObjectId(product_id)
    })

    return result
  }

  async delete(product_ids: string[]) {
    const productIdsObject = product_ids.map((item) => new ObjectId(item))
    await databasesService.products.deleteMany({
      _id: {
        $in: productIdsObject
      }
    })
    return {
      message: ADMIN_MESSAGE.DETELE_PRODUCT_SUCCESSFULLY
    }
  }
}

const adminProductsService = new AdminProductsService()
export default adminProductsService
