import express from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'
import { CONFIG_ENV, isProduction } from './constants/config'
import databasesService from './services/databases.services'
import defaultErrorHandler from './middlewares/defaultError.middlewares'
import authClientRouter from './routes/client/auth.routes'
import { initFolder } from './utils/file'
import authAdminRouter from './routes/admin/adminAuth.routes'
import adminProductRouter from './routes/admin/adminProduct.routes'
import purchaseRouter from './routes/client/purchase.routes'
import serveRouter from './routes/serve.routes'
import adminCategoryProductRouter from './routes/admin/adminCategoryProduct.routes'
import productRouter from './routes/client/product.routes'
import categoryProductRouter from './routes/client/categoryProduct.routes'

const fileSwaggerYaml = fs.readFileSync(path.resolve('myphamhanquoc.yaml'), 'utf8')
const swaggerDocuments = YAML.parse(fileSwaggerYaml)

initFolder()
databasesService.connect().then(() => {
  databasesService.indexUsers()
  databasesService.indexAdmins()
  databasesService.indexRefreshTokens()
  databasesService.indexProducts()
  databasesService.indexPurchases()
  databasesService.indexCategoryProducts()
})

const app = express()
const port = CONFIG_ENV.PORT
/* Middleware sercurity */
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 200,
//     standardHeaders: 'draft-8',
//     legacyHeaders: false
//   })
// )
app.use(helmet())
app.use(
  cors({
    origin: CONFIG_ENV.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  })
)
app.use(express.json())

/* Middleware routers client */
app.use('/auth', authClientRouter)
app.use('/purchases', purchaseRouter)
app.use('/products', productRouter)
app.use('/category-products', categoryProductRouter)
app.use('', serveRouter)

/* Middleware routers admin */
app.use('/admin/auth', authAdminRouter)
app.use('/admin/products', adminProductRouter)
app.use('/admin/category_products', adminCategoryProductRouter)

/* Swagger route */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocuments))
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Server running with port: ${port}`)
})
