import { Router } from 'express'
import {
  createAdminCategoryProductController,
  deleteAdminCategoryProductController,
  readAdminCategoryProductController,
  updateAdminCategoryProductController
} from '~/controllers/admin/adminCategoryProduct.controllers'
import {
  adminCategoryProductPaginationValidator,
  createAdminCategoryProductValidator,
  deleteAdminCategoryProductValidator,
  updateAdminCategoryProductValidator
} from '~/middlewares/admin/adminCategoryProducts.middlewares'
import { adminAccessTokenValidator, adminVerifiedUserValidator } from '~/middlewares/admin/adminUsers.middlewares'
import wrapRequestHandler from '~/utils/handler'

const adminCategoryProductRouter = Router()

/**
 * Description: Create admin category product
 * Path: /category_products
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: CreateAdminCategoryProductRequestBody
 * */
adminCategoryProductRouter.post(
  '/',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  createAdminCategoryProductValidator,
  wrapRequestHandler(createAdminCategoryProductController)
)

/**
 * Description: Update admin category product
 * Path: /category_products
 * Method: PATCH
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: UpdateAdminCategoryProductRequestBody
 * */
adminCategoryProductRouter.patch(
  '/',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  updateAdminCategoryProductValidator,
  wrapRequestHandler(updateAdminCategoryProductController)
)

/**
 * Description: Delete admin category product
 * Path: /delete
 * Method: DELETE
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: DeleteAdminCategoryProductRequestBody
 * */
adminCategoryProductRouter.delete(
  '/delete',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  deleteAdminCategoryProductValidator,
  wrapRequestHandler(deleteAdminCategoryProductController)
)

/**
 * Description: Read all product admin
 * Path: /category_products
 * Method: GET
 * Request header: { Authorization: Bearer <access_token> }
 * Request query: AdminCategoryProductPagination
 * */
adminCategoryProductRouter.get(
  '/',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  adminCategoryProductPaginationValidator,
  wrapRequestHandler(readAdminCategoryProductController)
)

export default adminCategoryProductRouter
