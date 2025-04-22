import { Router } from 'express'
import { serveImageController, serveImagesController } from '~/controllers/serve.controllers'

const serveRouter = Router()

/**
 * Description route: Serve static image route
 * Path: /image/:name
 * Method: GET
 * Request param: { name: string }
 * */
serveRouter.get('/image/:name', serveImageController)

/**
 * Description route: Serve static image route
 * Path: /images/:name
 * Method: GET
 * Request param: { name: string }
 * */
serveRouter.get('/images/:name', serveImagesController)

export default serveRouter
