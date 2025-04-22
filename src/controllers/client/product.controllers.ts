import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ProductDetailRequestParams, ProductListRequestQuery } from '~/models/requests/client/Product.requests'
import productsService from '~/services/client/products.services'

export const productListController = async (
  req: Request<ParamsDictionary, any, any, ProductListRequestQuery>,
  res: Response
) => {
  const payload = req.query
  const result = await productsService.productList(payload)
  res.json(result)
  return
}

export const productDetailController = async (req: Request<ProductDetailRequestParams>, res: Response) => {
  const product_id = req.params.product_id
  const result = await productsService.productDetail(product_id)
  res.json(result)
  return
}
