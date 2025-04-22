import { Request, Response } from 'express'
import categoryProductsService from '~/services/client/categoryProducts.services'

export const getCategoryProductController = async (req: Request, res: Response) => {
  const result = await categoryProductsService.getCategoryProduct()
  res.json(result)
  return
}
