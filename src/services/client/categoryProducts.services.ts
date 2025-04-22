import { ADMIN_MESSAGE } from '~/constants/message'
import databasesService from '../databases.services'

class CategoryProductsService {
  async getCategoryProduct() {
    const data = await databasesService.categoryProducts.find().toArray()
    return {
      message: ADMIN_MESSAGE.GET_CATEGORY_PRODUCT_SUCCESSFULLY,
      data
    }
  }
}

const categoryProductsService = new CategoryProductsService()
export default categoryProductsService
