import { ObjectId } from 'mongodb'

interface CategoryProductConstructor {
  _id?: ObjectId
  slug: string
  name: string
  created_at?: Date
  updated_at?: Date
}

export default class CategoryProduct {
  _id?: ObjectId
  slug: string
  name: string
  created_at: Date
  updated_at: Date
  constructor({ _id, slug, name, created_at, updated_at }: CategoryProductConstructor) {
    const date = new Date()
    this._id = _id
    this.slug = slug
    this.name = name
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
