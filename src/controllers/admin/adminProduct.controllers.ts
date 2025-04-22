import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CONFIG_PAGINATION } from '~/constants/config'
import { ADMIN_MESSAGE } from '~/constants/message'
import STATUS_CODE from '~/constants/statusCode'
import {
  CreateAdminProductRequestBody,
  DeleteAdminProductRequestBody,
  AdminProductPagination,
  ReadDetailAdminProductRequestParams,
  UpdateAdminProductRequestBody
} from '~/models/requests/admin/AdminProduct.requests'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import adminProductsService from '~/services/admin/adminProducts.services'
import mediasService from '~/services/medias.services'

export const createAdminProductController = async (
  req: Request<ParamsDictionary, any, CreateAdminProductRequestBody>,
  res: Response
) => {
  const payload = req.body
  const result = await adminProductsService.create(payload)
  res.json(result)
  return
}

export const updateAdminProductController = async (
  req: Request<ParamsDictionary, any, UpdateAdminProductRequestBody>,
  res: Response
) => {
  const payload = req.body
  const result = await adminProductsService.update(payload)
  res.json({
    message: ADMIN_MESSAGE.UPDATED_PRODUCT_SUCCESSFULLY,
    data: result
  })
  return
}

export const readAdminProductController = async (
  req: Request<ParamsDictionary, any, any, AdminProductPagination>,
  res: Response
) => {
  const page = Number(req.query?.page) || CONFIG_PAGINATION.PAGE
  const limit = Number(req.query?.limit) || CONFIG_PAGINATION.LIMIT
  const { products, total } = await adminProductsService.read({ page, limit })
  res.json({
    message: ADMIN_MESSAGE.GET_PRODUCT_SUCCESSFULLY,
    data: {
      products,
      pagination: {
        page,
        limit,
        page_size: Math.ceil(total / limit)
      }
    }
  })
  return
}

export const readDetailAdminProductController = async (
  req: Request<ReadDetailAdminProductRequestParams>,
  res: Response
) => {
  const product_id = req.params.product_id
  const result = await adminProductsService.readDetail(product_id)
  res.json({
    message: ADMIN_MESSAGE.GET_DETAIL_PRODUCT_SUCCESSFULLY,
    data: result
  })
  return
}

export const deleteAdminProductController = async (
  req: Request<ParamsDictionary, any, DeleteAdminProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const ids = req.body.product_ids
  for (const id of ids) {
    const checkProduct = await adminProductsService.isProduct(id)
    if (!checkProduct) {
      return next(
        new ErrorWithStatus({
          message: ADMIN_MESSAGE.PRODUCT_NOT_FOUND,
          status: STATUS_CODE.NOT_FOUND
        })
      )
    }
  }
  const result = await adminProductsService.delete(ids)
  res.json(result)
  return
}

export const uploadStaticImageAdminProductController = async (req: Request, res: Response) => {
  const respone = await mediasService.handleUploadStaticImage(req)
  res.json({
    message: ADMIN_MESSAGE.UPLOAD_IMAGE_SUCCESSFULLY,
    data: respone
  })
  return
}

export const uploadMultipleImagesAdminProductController = async (req: Request, res: Response) => {
  const respone = await mediasService.handleUploadMultipleImages(req)
  res.json({
    message: ADMIN_MESSAGE.UPLOAD_IMAGE_SUCCESSFULLY,
    data: respone
  })
  return
}
