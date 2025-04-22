import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CONFIG_PAGINATION } from '~/constants/config'
import { ADMIN_MESSAGE } from '~/constants/message'
import STATUS_CODE from '~/constants/statusCode'
import {
  AdminCategoryProductPagination,
  CreateAdminCategoryProductRequestBody,
  DeleteAdminCategoryProductRequestBody,
  UpdateAdminCategoryProductRequestBody
} from '~/models/requests/admin/AdminCategoryProduct.requests'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import adminCategoryProductsService from '~/services/admin/adminCategoryProducts.services'

export const readAdminCategoryProductController = async (
  req: Request<ParamsDictionary, any, any, AdminCategoryProductPagination>,
  res: Response
) => {
  const page = Number(req.query?.page) || CONFIG_PAGINATION.PAGE
  const limit = Number(req.query?.limit) || CONFIG_PAGINATION.LIMIT
  const { categoryProducts, total } = await adminCategoryProductsService.read({ page, limit })
  res.json({
    message: ADMIN_MESSAGE.GET_CATEGORY_PRODUCT_SUCCESSFULLY,
    data: {
      category_products: categoryProducts,
      pagination: {
        page,
        limit,
        page_size: Math.ceil(total / limit)
      }
    }
  })
  return
}

export const createAdminCategoryProductController = async (
  req: Request<ParamsDictionary, any, CreateAdminCategoryProductRequestBody>,
  res: Response
) => {
  const payload = req.body
  const result = await adminCategoryProductsService.create(payload)
  res.json(result)
  return
}

export const updateAdminCategoryProductController = async (
  req: Request<ParamsDictionary, any, UpdateAdminCategoryProductRequestBody>,
  res: Response
) => {
  const payload = req.body
  const result = await adminCategoryProductsService.update(payload)
  res.json(result)
  return
}

export const deleteAdminCategoryProductController = async (
  req: Request<ParamsDictionary, any, DeleteAdminCategoryProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const ids = req.body.category_ids
  for (const id of ids) {
    const checkCategoryProduct = await adminCategoryProductsService.isCategoryProduct(id)
    if (!checkCategoryProduct) {
      return next(
        new ErrorWithStatus({
          message: ADMIN_MESSAGE.CATEGORY_PRODUCT_NOT_FOUND,
          status: STATUS_CODE.NOT_FOUND
        })
      )
    }
  }
  const result = await adminCategoryProductsService.delete(ids)
  res.json(result)
  return
}
