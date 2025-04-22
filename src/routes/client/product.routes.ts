import { Router } from 'express'
import { productDetailController, productListController } from '~/controllers/client/product.controllers'
import {
  productDetailValidator,
  productListValidator,
  productPaginationValidator
} from '~/middlewares/client/products.middlewares'
import wrapRequestHandler from '~/utils/handler'

const productRouter = Router()

/**
 * Description: Product list
 * Path: /products
 * Method: GET
 * Request query: ProductListRequestQuery
 * */
productRouter.get('/', productPaginationValidator, productListValidator, wrapRequestHandler(productListController))

/**
 * Description: Product detail
 * Path: /:product_id
 * Method: GET
 * Request params: { product_id: string }
 * */
productRouter.get('/:product_id', productDetailValidator, wrapRequestHandler(productDetailController))

export default productRouter
