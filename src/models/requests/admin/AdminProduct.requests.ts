import { ParamsDictionary, Query } from 'express-serve-static-core'

export interface CreateAdminProductRequestBody {
  category?: string
  image?: string
  images?: string[]
  slug: string
  name: string
  price: number
  price_before_discount?: number
  quantity: number
  sold: number
  view: number
  rating: number
  description?: string
  seo_title?: string
  seo_keywords?: string
  seo_description?: string
  created_at?: Date
  updated_at?: Date
}

export interface UpdateAdminProductRequestBody {
  product_id: string
  category?: string
  image?: string
  images?: string[]
  slug?: string
  name?: string
  price?: number
  price_before_discount?: number
  quantity?: number
  sold?: number
  view?: number
  rating?: number
  description?: string
  seo_title?: string
  seo_keywords?: string
  seo_description?: string
  updated_at?: Date
}

export interface DeleteAdminProductRequestBody {
  product_ids: string[]
}

export interface ReadDetailAdminProductRequestParams extends ParamsDictionary {
  product_id: string
}

export interface AdminProductPagination extends Query {
  page?: string
  limit?: string
}
