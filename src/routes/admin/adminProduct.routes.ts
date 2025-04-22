import { Router } from 'express'
import {
  createAdminProductController,
  deleteAdminProductController,
  readAdminProductController,
  readDetailAdminProductController,
  updateAdminProductController,
  uploadMultipleImagesAdminProductController,
  uploadStaticImageAdminProductController
} from '~/controllers/admin/adminProduct.controllers'
import {
  adminProductPaginationValidator,
  createAdminProductValidator,
  deleteAdminProductValidator,
  readDetailAdminProductValidator,
  updateAdminProductValidator
} from '~/middlewares/admin/adminProducts.middlewares'
import { adminAccessTokenValidator, adminVerifiedUserValidator } from '~/middlewares/admin/adminUsers.middlewares'
import wrapRequestHandler from '~/utils/handler'

const adminProductRouter = Router()

/**
 * Description: Create admin product
 * Path: /products
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: CreateAdminProductRequestBody
 * */
adminProductRouter.post(
  '/',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  createAdminProductValidator,
  wrapRequestHandler(createAdminProductController)
)

/**
 * Description: Update admin product
 * Path: /products
 * Method: PATCH
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: UpdateAdminProductRequestBody
 * */
adminProductRouter.patch(
  '/',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  updateAdminProductValidator,
  wrapRequestHandler(updateAdminProductController)
)

/**
 * Description: Delete admin product
 * Path: /delete
 * Method: DELETE
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: DeleteAdminProductRequestBody
 * */
adminProductRouter.delete(
  '/delete',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  deleteAdminProductValidator,
  wrapRequestHandler(deleteAdminProductController)
)

/**
 * Description: Read detail product admin
 * Path: /:product_id
 * Method: GET
 * Request header: { Authorization: Bearer <access_token> }
 * Request params: ReadDetailAdminProductRequestParams
 * */
adminProductRouter.get(
  '/:product_id',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  readDetailAdminProductValidator,
  wrapRequestHandler(readDetailAdminProductController)
)

/**
 * Description: Read all product admin
 * Path: /products
 * Method: GET
 * Request header: { Authorization: Bearer <access_token> }
 * Request query: AdminProductPagination
 * */
adminProductRouter.get(
  '/',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  adminProductPaginationValidator,
  wrapRequestHandler(readAdminProductController)
)

/**
 * Description route: Upload image product
 * path: /upload-image
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request form data: { image: string }
 * */
adminProductRouter.post(
  '/upload-image',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  wrapRequestHandler(uploadStaticImageAdminProductController)
)

/**
 * Description route: Upload images product
 * path: /upload-images
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request form data: { images: string }
 * */
adminProductRouter.post(
  '/upload-images',
  adminAccessTokenValidator,
  adminVerifiedUserValidator,
  wrapRequestHandler(uploadMultipleImagesAdminProductController)
)

export default adminProductRouter
