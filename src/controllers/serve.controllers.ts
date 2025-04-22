import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE, UPLOAD_IMAGES } from '~/constants/dir'
import { ServeImageRequestParams, ServeImagesRequestParams } from '~/models/requests/Serve.requests'

export const serveImageController = (req: Request<ServeImageRequestParams>, res: Response) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_IMAGE, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not Found')
    }
  })
  return
}

export const serveImagesController = (req: Request<ServeImagesRequestParams>, res: Response) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_IMAGES, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not Found')
    }
  })
  return
}
