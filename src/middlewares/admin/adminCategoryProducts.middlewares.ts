import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { ADMIN_MESSAGE } from '~/constants/message'
import { REGEX_SLUG } from '~/constants/regex'
import STATUS_CODE from '~/constants/statusCode'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import adminCategoryProductsService from '~/services/admin/adminCategoryProducts.services'
import databasesService from '~/services/databases.services'
import validate from '~/utils/validation'

const slugSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.SLUG_MUST_BE_STRING
  },
  isLength: {
    options: {
      min: 1,
      max: 500
    },
    errorMessage: ADMIN_MESSAGE.SLUG_LENGTH
  },
  trim: true
}

const nameSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.NAME_CATEGORY_PRODUCT_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 500
    },
    errorMessage: ADMIN_MESSAGE.NAME_CATEGORY_PRODUCT_LENGTH
  }
}

const categoryProductIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.CATEGORY_PRODUCT_ID_IS_REQUIRED
  },
  custom: {
    options: async (value: string, { req }) => {
      if (typeof value !== 'string') {
        throw new Error(ADMIN_MESSAGE.CATEGORY_PRODUCT_ID_MUST_BE_STRING)
      }

      if (!ObjectId.isValid(value)) {
        throw new Error(ADMIN_MESSAGE.CATEGORY_PRODUCT_ID_INVALID)
      }

      try {
        const categoryProduct = await databasesService.categoryProducts.findOne({ _id: new ObjectId(value) })
        if (categoryProduct === null) {
          throw new ErrorWithStatus({
            message: ADMIN_MESSAGE.CATEGORY_PRODUCT_NOT_FOUND,
            status: STATUS_CODE.NOT_FOUND
          })
        }
        return true
      } catch (error) {
        throw error
      }
    }
  }
}

const categoryProductIdsSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.CATEGORY_PRODUCT_IDS_IS_REQUIRED
  },
  isArray: {
    errorMessage: ADMIN_MESSAGE.CATEGORY_PRODUCT_IDS_MUST_BE_ARRAY
  },
  custom: {
    options: (value: string[]) => {
      if (value.length > 0 && !value.every((item) => typeof item === 'string')) {
        throw new Error(ADMIN_MESSAGE.CATEGORY_PRODUCT_IDS_ITEM_MUST_BE_ARRAY_STRING)
      }
      return true
    }
  }
}

export const createAdminCategoryProductValidator = validate(
  checkSchema(
    {
      slug: {
        ...slugSchema,
        notEmpty: {
          errorMessage: ADMIN_MESSAGE.SLUG_IS_REQUIRED
        },
        custom: {
          options: async (value: string) => {
            if (!REGEX_SLUG.test(value)) {
              throw new Error(ADMIN_MESSAGE.SLUG_INVALID)
            }
            try {
              const isSlug = await adminCategoryProductsService.checkSlugExist(value)
              if (isSlug) {
                throw new Error(ADMIN_MESSAGE.SLUG_ALREADY_EXISTS)
              }
              return true
            } catch (error) {
              throw error
            }
          }
        }
      },
      name: nameSchema
    },
    ['body']
  )
)

export const updateAdminCategoryProductValidator = validate(
  checkSchema(
    {
      category_id: categoryProductIdSchema,
      slug: {
        ...slugSchema,
        notEmpty: {
          errorMessage: ADMIN_MESSAGE.SLUG_IS_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            if (!REGEX_SLUG.test(value)) {
              throw new Error(ADMIN_MESSAGE.SLUG_INVALID)
            }
            try {
              const category_id = req.body.category_id as string
              if (category_id) {
                const categoryProductsByCategoryProductId = await databasesService.categoryProducts
                  .find({
                    _id: {
                      $ne: new ObjectId(category_id)
                    }
                  })
                  .toArray()
                const isSlug = categoryProductsByCategoryProductId.some((item) => item.slug === value)
                if (isSlug) {
                  throw new Error(ADMIN_MESSAGE.SLUG_ALREADY_EXISTS)
                }
              }
              return true
            } catch (error) {
              throw error
            }
          }
        },
        optional: true
      },
      name: {
        ...nameSchema,
        optional: true
      }
    },
    ['body']
  )
)

export const deleteAdminCategoryProductValidator = validate(
  checkSchema(
    {
      category_ids: categoryProductIdsSchema
    },
    ['body']
  )
)

export const adminCategoryProductPaginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        custom: {
          options: (value) => {
            const number = Number(value)
            if (number < 1 || number > 100) {
              throw new Error('Limit from 1 to 100')
            }
            return true
          }
        },
        optional: true
      },
      page: {
        isNumeric: true,
        custom: {
          options: (value) => {
            const number = Number(value)
            if (number < 1) {
              throw new Error('Page > 0')
            }
            return true
          }
        },
        optional: true
      }
    },
    ['query']
  )
)
