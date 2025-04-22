import { Query } from 'express-serve-static-core'

export interface CreateAdminCategoryProductRequestBody {
  slug: string
  name: string
}

export interface UpdateAdminCategoryProductRequestBody {
  category_id: string
  slug?: string
  name?: string
}

export interface DeleteAdminCategoryProductRequestBody {
  category_ids: string[]
}

export interface AdminCategoryProductPagination extends Query {
  page?: string
  limit?: string
}
