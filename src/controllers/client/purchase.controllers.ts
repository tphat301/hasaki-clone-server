import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId, WithId } from 'mongodb'
import { StatusCart } from '~/constants/enum'
import { ADMIN_MESSAGE } from '~/constants/message'
import STATUS_CODE from '~/constants/statusCode'
import {
  AddToCartRequestBody,
  BuyCartRequestBody,
  DeleteCartRquestBody,
  ReadCartRequestQuery,
  UpdateCartRequestBody
} from '~/models/requests/client/Purchase.requests'
import { TokenPayLoad } from '~/models/requests/client/User.requests'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import Product from '~/models/schemas/Product.schema'
import Purchase from '~/models/schemas/Purchase.schema'
import purchasesService from '~/services/client/purchases.services'
import databasesService from '~/services/databases.services'

export const addToCartController = async (
  req: Request<ParamsDictionary, any, AddToCartRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const { product_id, buy_count } = req.body
  const product = req.product as Product
  const isCartExist = await purchasesService.isProductInCart(product_id)
  if (isCartExist) {
    const cart = (await databasesService.purchases.findOne({
      product_id: new ObjectId(product_id),
      status: StatusCart.UnActive
    })) as WithId<Purchase>
    if (cart.buy_count > product.quantity) {
      return next(
        new ErrorWithStatus({
          message: ADMIN_MESSAGE.TOTAL_BUYCOUNT_NOT_ALLOW_GREATER_THAN_QUANTITY_OF_PRODUCT,
          status: STATUS_CODE.UNPROCESSABLE_ENTITY
        })
      )
    }
  }
  if (Number(buy_count) > product.quantity) {
    return next(
      new ErrorWithStatus({
        message: ADMIN_MESSAGE.BUYCOUNT_NOT_ALLOW_GREATER_THAN_QUANTITY_OF_PRODUCT,
        status: STATUS_CODE.UNPROCESSABLE_ENTITY
      })
    )
  }
  const result = await purchasesService.addToCart({ buy_count, product_id, user_id, isCartExist })
  res.json(result)
  return
}

export const updateCartController = async (
  req: Request<ParamsDictionary, any, UpdateCartRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { product_id, buy_count } = req.body
  const product = req.product as Product
  if (Number(buy_count) > product.quantity) {
    return next(
      new ErrorWithStatus({
        message: ADMIN_MESSAGE.BUYCOUNT_NOT_ALLOW_GREATER_THAN_QUANTITY_OF_PRODUCT,
        status: STATUS_CODE.UNPROCESSABLE_ENTITY
      })
    )
  }
  const isCartExist = await purchasesService.isProductInCart(product_id)
  if (!isCartExist) {
    return next(
      new ErrorWithStatus({
        message: ADMIN_MESSAGE.PURCHASE_NOT_FOUND,
        status: STATUS_CODE.NOT_FOUND
      })
    )
  }
  const cart = (await databasesService.purchases.findOne({
    product_id: new ObjectId(product_id),
    status: StatusCart.UnActive
  })) as WithId<Purchase>
  if (cart.buy_count > product.quantity) {
    return next(
      new ErrorWithStatus({
        message: ADMIN_MESSAGE.TOTAL_BUYCOUNT_NOT_ALLOW_GREATER_THAN_QUANTITY_OF_PRODUCT,
        status: STATUS_CODE.UNPROCESSABLE_ENTITY
      })
    )
  }
  const result = await purchasesService.updateCart({ product_id, buy_count })
  res.json({
    message: ADMIN_MESSAGE.UPDATE_CART_SUCCESSFULLY,
    data: result
  })
  return
}

export const readCartController = async (
  req: Request<ParamsDictionary, any, any, ReadCartRequestQuery>,
  res: Response
) => {
  const status = req.query.status
  const result = await purchasesService.readCart(status)
  res.json({
    message: ADMIN_MESSAGE.GET_CART_SUCCESSFULLY,
    data: result
  })
  return
}

export const deleteCartController = async (
  req: Request<ParamsDictionary, any, DeleteCartRquestBody>,
  res: Response
) => {
  const { puschase_ids } = req.body
  const result = await purchasesService.deleteCart(puschase_ids)
  res.json(result)
  return
}

export const buyProductsController = async (
  req: Request<ParamsDictionary, any, BuyCartRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { body_cart: payload } = req.body
  for (const value of payload) {
    const buy_count = value.buy_count
    const product = (await databasesService.products.findOne({
      _id: new ObjectId(value.product_id)
    })) as WithId<Product>
    if (Number(buy_count) > product.quantity) {
      return next(
        new ErrorWithStatus({
          message: ADMIN_MESSAGE.BUYCOUNT_NOT_ALLOW_GREATER_THAN_QUANTITY_OF_PRODUCT,
          status: STATUS_CODE.UNPROCESSABLE_ENTITY
        })
      )
    }
    const isCartExist = await purchasesService.isProductInCart(value.product_id)
    if (!isCartExist) {
      return next(
        new ErrorWithStatus({
          message: ADMIN_MESSAGE.PURCHASE_NOT_FOUND,
          status: STATUS_CODE.NOT_FOUND
        })
      )
    }
  }
  const result = await purchasesService.buyProducts(payload)
  res.json(result)
  return
}
