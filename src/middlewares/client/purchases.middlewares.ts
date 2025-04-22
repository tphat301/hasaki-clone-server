import { Request } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { StatusCart } from '~/constants/enum'
import { ADMIN_MESSAGE } from '~/constants/message'
import STATUS_CODE from '~/constants/statusCode'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import databasesService from '~/services/databases.services'
import { stringEnumToArray } from '~/utils/commons'
import validate from '~/utils/validation'

const statusTypes = stringEnumToArray(StatusCart)

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
        ;(req as Request).product = product
        return true
      } catch (error) {
        throw error
      }
    }
  }
}

const buyCountSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.BUYCOUNT_IS_REQUIRED
  },
  custom: {
    options: (value: number) => {
      if (typeof value !== 'number') {
        throw new Error(ADMIN_MESSAGE.BUY_COUNT_MUST_BE_NUMBER)
      }
      if (!Number.isInteger(value) && value < 1) {
        throw new Error(ADMIN_MESSAGE.BUYCOUNT_MUST_BE_INT_NUMBER_FROM_1)
      }
      return true
    }
  },
  trim: true
}

const purchaseIdsSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.PURCHASE_IDS_IS_REQUIRED
  },
  isArray: {
    errorMessage: ADMIN_MESSAGE.PURCHASE_IDS_MUST_BE_ARRAY
  },
  custom: {
    options: (value: string[]) => {
      if (value.length > 0 && !value.every((item) => typeof item === 'string')) {
        throw new Error(ADMIN_MESSAGE.PURCHASE_IDS_ITEM_MUST_BE_ARRAY_STRING)
      }
      return true
    }
  }
}

export const addToCartValidator = validate(
  checkSchema(
    {
      product_id: productIdSchema,
      buy_count: buyCountSchema
    },
    ['body']
  )
)

export const updateCartValidator = validate(
  checkSchema(
    {
      product_id: productIdSchema,
      buy_count: buyCountSchema
    },
    ['body']
  )
)

export const readCartValidator = validate(
  checkSchema(
    {
      status: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGE.STATUS_CART_IS_REQUIRED
        },
        custom: {
          options: (value: StatusCart) => {
            if (!statusTypes.includes(value)) {
              throw new Error(ADMIN_MESSAGE.STATUS_CART_INVALID)
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)

export const deleteCartValidator = validate(
  checkSchema(
    {
      puschase_ids: purchaseIdsSchema
    },
    ['body']
  )
)

export const buyCartValidator = validate(
  checkSchema(
    {
      body_cart: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGE.BODY_CART_BUY_IS_REQUIRED
        },
        isArray: {
          errorMessage: ADMIN_MESSAGE.BODY_CART_BUY_MUST_BE_ARRAY
        },
        custom: {
          options: (value) => {
            if (!value.every((item: any) => typeof item === 'object')) {
              throw new Error(ADMIN_MESSAGE.ITEM_BODY_CART_BUY_MUST_BE_OBJECT)
            }
            return true
          }
        }
      },
      'body_cart.*.product_id': productIdSchema,
      'body_cart.*.buy_count': buyCountSchema
    },
    ['body']
  )
)
