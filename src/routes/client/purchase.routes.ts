import { Router } from 'express'
import {
  addToCartController,
  buyProductsController,
  deleteCartController,
  readCartController,
  updateCartController
} from '~/controllers/client/purchase.controllers'
import {
  addToCartValidator,
  buyCartValidator,
  deleteCartValidator,
  readCartValidator,
  updateCartValidator
} from '~/middlewares/client/purchases.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/client/users.middlewares'
import wrapRequestHandler from '~/utils/handler'

const purchaseRouter = Router()

/**
 * Description: Add to cart
 * Path: /add-to-cart
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: { product_id: string, buy_count: number }
 * */
purchaseRouter.post(
  '/add-to-cart',
  accessTokenValidator,
  verifiedUserValidator,
  addToCartValidator,
  wrapRequestHandler(addToCartController)
)

/**
 * Description: Update purchase
 * Path: /update-cart
 * Method: PATCH
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: { product_id: string, buy_count: number }
 * */
purchaseRouter.patch(
  '/update-cart',
  accessTokenValidator,
  verifiedUserValidator,
  updateCartValidator,
  wrapRequestHandler(updateCartController)
)

/**
 * Description: Read list purchase
 * Path: /purchases
 * Method: GET
 * Request header: { Authorization: Bearer <access_token> }
 * Request query: ReadCartRequestQuery
 * */
purchaseRouter.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  readCartValidator,
  wrapRequestHandler(readCartController)
)

/**
 * Description: Delete purchase
 * Path: /purchases
 * Method: DELETE
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: DeleteCartRquestBody
 * */
purchaseRouter.delete(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  deleteCartValidator,
  wrapRequestHandler(deleteCartController)
)

/**
 * Description: Buy products
 * Path: /buy-products
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request query: BuyCartRequestBody
 * */
purchaseRouter.post(
  '/buy-products',
  accessTokenValidator,
  verifiedUserValidator,
  buyCartValidator,
  wrapRequestHandler(buyProductsController)
)

export default purchaseRouter
