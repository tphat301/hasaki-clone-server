import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_IMAGE, UPLOAD_IMAGES } from '~/constants/dir'

export const initFolder = () => {
  const uploads = [UPLOAD_IMAGE, UPLOAD_IMAGES]
  uploads.forEach((upload) => {
    if (!fs.existsSync(upload)) {
      fs.mkdirSync(upload, {
        recursive: true
      })
    }
  })
}

export const uploadStaticImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 4 * 1024 * 1024, // 4MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!Boolean(files.image)) {
        return reject(new Error('File not empty'))
      }
      resolve((files.image as File[])[0])
    })
  })
}

export const uploadMultipleImages = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const uploadDir = UPLOAD_IMAGES
  const form = formidable({
    uploadDir,
    maxFiles: 10,
    maxFileSize: 30 * 1024 * 1024, // 30MB
    maxTotalFileSize: 30 * 1024 * 1024 * 10, // 300MB
    keepExtensions: true,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'images' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.images)) {
        return reject(new Error('File not empty'))
      }
      resolve(files.images as File[])
    })
  })
}
