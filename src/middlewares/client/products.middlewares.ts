import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { Order, SortBy } from '~/constants/enum'
import { ADMIN_MESSAGE } from '~/constants/message'
import STATUS_CODE from '~/constants/statusCode'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import databasesService from '~/services/databases.services'
import { stringEnumToArray } from '~/utils/commons'
import validate from '~/utils/validation'

const orderTypes = stringEnumToArray(Order)
const sortByTypes = stringEnumToArray(SortBy)

const ratingFilterSchema: ParamSchema = {
  isInt: {
    errorMessage: ADMIN_MESSAGE.RATING_FILTER_MUST_BE_INT_NUMBER
  },
  toInt: true,
  custom: {
    options: async (value: number) => {
      if (Number(value) < 1 || Number(value) > 5) {
        throw new Error(ADMIN_MESSAGE.RATING_FILTER_LIMIT_FROM_1_TO_5)
      }
      return true
    }
  }
}

const productIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.PRODUCT_IDS_IS_REQUIRED
  },
  custom: {
    options: async (value: string, { req }) => {
      if (typeof value !== 'string') {
        throw new Error(ADMIN_MESSAGE.PRODUCT_ID_MUST_BE_STRING)
      }
      if (!ObjectId.isValid(value)) {
        throw new Error(ADMIN_MESSAGE.PRODUCT_ID_INVALID)
      }
      try {
        const product = await databasesService.products.findOne({ _id: new ObjectId(value) })
        if (product === null) {
          throw new ErrorWithStatus({
            message: ADMIN_MESSAGE.PRODUCT_NOT_FOUND,
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

const categorySchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.CATEGORY_ID_INVALID
  },
  custom: {
    options: async (value: string, { req }) => {
      if (typeof value !== 'string') {
        throw new Error(ADMIN_MESSAGE.CATEGORY_ID_MUST_BE_STRING)
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

const priceSchema: ParamSchema = {
  isInt: {
    errorMessage: ADMIN_MESSAGE.PRICE_PRODUCT_MUST_BE_INT
  },
  toInt: true,
  custom: {
    options: (value: number) => {
      if (typeof value !== 'number') {
        throw new Error(ADMIN_MESSAGE.PRICE_PRODUCT_MUST_BE_NUMBER)
      }
      if (Number(value) < 1) {
        throw new Error(ADMIN_MESSAGE.PRICE_PRODUCT_GREATER_THAN_1)
      }
      return true
    }
  }
}

const nameSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.NAME_PRODUCT_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 500
    },
    errorMessage: ADMIN_MESSAGE.NAME_PRODUCT_LENGTH
  }
}

export const productPaginationValidator = validate(
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

export const productListValidator = validate(
  checkSchema(
    {
      order: {
        isIn: {
          options: [orderTypes],
          errorMessage: ADMIN_MESSAGE.ORDER_MUST_BE_ASC_OR_DESC
        },
        optional: true
      },
      sort_by: {
        isIn: {
          options: [sortByTypes],
          errorMessage: ADMIN_MESSAGE.SORT_BY_MUST_BE_CREATED_AT_VIEW_SOLD_OR_PRICE
        },
        optional: true
      },
      category: {
        ...categorySchema,
        optional: true
      },
      exclude: {
        ...productIdSchema,
        optional: true
      },
      rating_filter: {
        ...ratingFilterSchema,
        optional: true
      },
      price_max: {
        ...priceSchema,
        optional: true
      },
      price_min: {
        ...priceSchema,
        optional: true
      },
      name: {
        ...nameSchema,
        optional: true
      }
    },
    ['query']
  )
)

export const productDetailValidator = validate(
  checkSchema(
    {
      product_id: productIdSchema
    },
    ['params']
  )
)
