import { ObjectId } from 'mongodb'

interface ProductConstructor {
  _id?: ObjectId
  category?: ObjectId | null
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

export default class Product {
  _id?: ObjectId
  category: ObjectId | null
  image: string
  images: string[]
  slug: string
  name: string
  price: number
  price_before_discount: number
  quantity: number
  sold: number
  view: number
  rating: number
  description: string
  seo_title: string
  seo_keywords: string
  seo_description: string
  created_at: Date
  updated_at: Date
  constructor({
    name,
    price,
    quantity,
    rating,
    slug,
    sold,
    view,
    category,
    created_at,
    description,
    _id,
    image,
    images,
    price_before_discount,
    seo_description,
    seo_keywords,
    seo_title,
    updated_at
  }: ProductConstructor) {
    const date = new Date()
    this._id = _id
    this.category = category || null
    this.image = image || ''
    this.images = images || []
    this.slug = slug
    this.name = name
    this.price = price
    this.price_before_discount = price_before_discount || 0
    this.quantity = quantity
    this.sold = sold
    this.view = view
    this.rating = rating
    this.description = description || ''
    this.seo_title = seo_title || ''
    this.seo_keywords = seo_keywords || ''
    this.seo_description = seo_description || ''
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
