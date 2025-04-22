import { Request } from 'express'
import { CONFIG_ENV, isProduction } from '~/constants/config'
import { uploadMultipleImages, uploadStaticImage } from '~/utils/file'

class MediasService {
  async handleUploadStaticImage(req: Request) {
    const file = await uploadStaticImage(req)
    const fileName = file.newFilename
    const url = isProduction
      ? `${CONFIG_ENV.SERVER_URL}/image/${fileName}`
      : `${CONFIG_ENV.SERVER_URL}:${CONFIG_ENV.PORT}/image/${fileName}`
    return url
  }

  async handleUploadMultipleImages(req: Request) {
    const files = await uploadMultipleImages(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const fileName = file.newFilename
        const url = isProduction
          ? `${CONFIG_ENV.SERVER_URL}/images/${fileName}`
          : `${CONFIG_ENV.SERVER_URL}:${CONFIG_ENV.PORT}/images/${fileName}`
        return url
      })
    )
    return result
  }
}

const mediasService = new MediasService()
export default mediasService
