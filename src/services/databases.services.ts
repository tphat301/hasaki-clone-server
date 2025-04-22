import { MongoClient, Db, Collection } from 'mongodb'
import { CONFIG_ENV } from '~/constants/config'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Admin from '~/models/schemas/Admin.schema'
import Product from '~/models/schemas/Product.schema'
import User from '~/models/schemas/User.schema'
import Purchase from '~/models/schemas/Purchase.schema'
import CategoryProduct from '~/models/schemas/CategoryProduct.schema'

const uri = `mongodb+srv://${CONFIG_ENV.DB_USERNAME}:${CONFIG_ENV.DB_PASSWORD}@myphamhanquoc-cluster.zqotolc.mongodb.net/?appName=myphamhanquoc-Cluster`

class DatabasesService {
  private db: Db
  private client: MongoClient
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(CONFIG_ENV.DB_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async indexProducts() {
    const isExistIndex = await this.products.indexExists(['name_text', 'slug_1'])
    if (!isExistIndex) {
      this.products.createIndex({ name: 'text' }, { default_language: 'none' })
      this.products.createIndex({ slug: 1 }, { unique: true })
    }
  }

  async indexCategoryProducts() {
    const isExistIndex = await this.categoryProducts.indexExists(['slug_1'])
    if (!isExistIndex) {
      this.categoryProducts.createIndex({ slug: 1 }, { unique: true })
    }
  }

  async indexUsers() {
    const isExistIndex = await this.users.indexExists(['email_1_password_1', 'email_1'])
    if (!isExistIndex) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
    }
  }

  async indexAdmins() {
    const isExistIndex = await this.admins.indexExists(['email_1_password_1', 'email_1'])
    if (!isExistIndex) {
      this.admins.createIndex({ email: 1, password: 1 })
      this.admins.createIndex({ email: 1 }, { unique: true })
    }
  }

  async indexRefreshTokens() {
    const isExistIndex = await this.refreshTokens.indexExists(['token_1', 'exp_1'])
    if (!isExistIndex) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    }
  }

  async indexPurchases() {
    const isExistIndex = await this.purchases.indexExists(['product_id_1_status_1', 'product_id_1'])
    if (!isExistIndex) {
      this.purchases.createIndex({ product_id: 1, status: 1 })
      this.purchases.createIndex({ product_id: 1 })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(CONFIG_ENV.DB_COLLECTION_USERS)
  }

  get admins(): Collection<Admin> {
    return this.db.collection(CONFIG_ENV.DB_COLLECTION_ADMINS)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(CONFIG_ENV.DB_COLLECTION_REFRESH_TOKENS)
  }

  get products(): Collection<Product> {
    return this.db.collection(CONFIG_ENV.DB_COLLECTION_PRODUCTS)
  }

  get purchases(): Collection<Purchase> {
    return this.db.collection(CONFIG_ENV.DB_COLLECTION_PURCHASES)
  }

  get categoryProducts(): Collection<CategoryProduct> {
    return this.db.collection(CONFIG_ENV.DB_COLLECTION_CATEGORY_PRODUCTS)
  }
}

const databasesService = new DatabasesService()
export default databasesService
