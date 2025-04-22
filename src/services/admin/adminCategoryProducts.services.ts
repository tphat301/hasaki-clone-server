import {
  CreateAdminCategoryProductRequestBody,
  UpdateAdminCategoryProductRequestBody
} from '~/models/requests/admin/AdminCategoryProduct.requests'
import databasesService from '../databases.services'
import CategoryProduct from '~/models/schemas/CategoryProduct.schema'
import { ADMIN_MESSAGE } from '~/constants/message'
import { omit } from 'lodash'
import { ObjectId } from 'mongodb'

class AdminCategoryProductsService {
  async checkSlugExist(slug: string) {
    const categoryProduct = await databasesService.categoryProducts.findOne({ slug })
    return Boolean(categoryProduct)
  }

  async isCategoryProduct(product_id: string) {
    const categoryProduct = await databasesService.categoryProducts.findOne({ _id: new ObjectId(product_id) })
    return Boolean(categoryProduct)
  }

  async create(payload: CreateAdminCategoryProductRequestBody) {
    const { slug, name } = payload
    await databasesService.categoryProducts.insertOne(
      new CategoryProduct({
        slug,
        name
      })
    )
    return {
      message: ADMIN_MESSAGE.CREATED_CATEGORY_PRODUCT_SUCCESSFULLY
    }
  }

  async update(payload: UpdateAdminCategoryProductRequestBody) {
    const { category_id } = payload
    const datasInsert = omit(payload, ['category_id'])
    for (const key in datasInsert) {
      const typeKey = key as keyof typeof datasInsert
      const value = datasInsert[typeKey]
      if (value === undefined) {
        delete datasInsert[typeKey]
        continue
      }
    }
    const result = await databasesService.categoryProducts.findOneAndUpdate(
      {
        _id: new ObjectId(category_id)
      },
      {
        $set: {
          ...datasInsert
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      message: ADMIN_MESSAGE.UPDATED_CATEGORY_PRODUCT_SUCCESSFULLY,
      data: result
    }
  }

  async delete(category_ids: string[]) {
    const categoryProductIdsObject = category_ids.map((item) => new ObjectId(item))
    await databasesService.categoryProducts.deleteMany({
      _id: {
        $in: categoryProductIdsObject
      }
    })
    return {
      message: ADMIN_MESSAGE.DETELE_CATEGORY_PRODUCT_SUCCESSFULLY
    }
  }

  async read({ page, limit }: { page: number; limit: number }) {
    const [categoryProducts, total] = await Promise.all([
      databasesService.categoryProducts
        .aggregate([
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databasesService.categoryProducts.countDocuments()
    ])
    return {
      categoryProducts,
      total
    }
  }
}

const adminCategoryProductsService = new AdminCategoryProductsService()
export default adminCategoryProductsService
