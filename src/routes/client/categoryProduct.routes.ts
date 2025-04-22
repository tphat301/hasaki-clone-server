import { Router } from 'express'
import { getCategoryProductController } from '~/controllers/client/categoryProducts.controllers'
import wrapRequestHandler from '~/utils/handler'

const categoryProductRouter = Router()

/**
 * Description: Get category product
 * Path: /category-products
 * Method: GET
 * */
categoryProductRouter.get('/', wrapRequestHandler(getCategoryProductController))

export default categoryProductRouter
