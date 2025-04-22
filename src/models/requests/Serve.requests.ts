import { ParamsDictionary } from 'express-serve-static-core'

export interface ServeImageRequestParams extends ParamsDictionary {
  name: string
}

export interface ServeImagesRequestParams extends ParamsDictionary {
  name: string
}
