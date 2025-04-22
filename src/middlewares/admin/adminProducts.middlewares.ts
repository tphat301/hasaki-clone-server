import { Request } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { ADMIN_MESSAGE } from '~/constants/message'
import { REGEX_SLUG } from '~/constants/regex'
import STATUS_CODE from '~/constants/statusCode'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import adminProductsService from '~/services/admin/adminProducts.services'
import databasesService from '~/services/databases.services'
import validate from '~/utils/validation'

/* Declare variable schema */
const productIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.PRODUCT_ID_IS_REQUIRED
  },
  custom: {
    options: async (value: string, { req }) => {
      if (typeof value !== 'string') {
        throw new Error(ADMIN_MESSAGE.PRODUCT_ID_MUST_BE_STRING)
      }

      if (!ObjectId.isValid(value)) {
        throw new Error(ADMIN_MESSAGE.PRODUCT_ID_INVALID)
      }

      try {
        const product = await databasesService.products.findOne({ _id: new ObjectId(value) })
        if (product === null) {
          throw new ErrorWithStatus({
            message: ADMIN_MESSAGE.PRODUCT_NOT_FOUND,
            status: STATUS_CODE.NOT_FOUND
          })
        }
        ;(req as Request).product = product
        return true
      } catch (error) {
        throw error
      }
    }
  }
}

const categorySchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.CATEGORY_ID_IS_REQUIRED
  },
  custom: {
    options: (value: string) => {
      if (typeof value !== 'string') {
        throw new Error(ADMIN_MESSAGE.CATEGORY_ID_MUST_BE_STRING)
      }
      if (!ObjectId.isValid(value)) {
        throw new Error(ADMIN_MESSAGE.CATEGORY_ID_INVALID)
      }
      return true
    }
  }
}

const imageSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.IMAGE_MUST_BE_STRING
  },
  isLength: {
    options: {
      min: 1,
      max: 1000
    },
    errorMessage: ADMIN_MESSAGE.IMAGE_LENGTH
  }
}

const imagesSchema: ParamSchema = {
  isArray: {
    errorMessage: ADMIN_MESSAGE.IMAGES_MUST_BE_ARRAY_STRING
  },
  custom: {
    options: (value: string[]) => {
      if (value.length > 0 && !value.every((item) => typeof item === 'string')) {
        throw new Error(ADMIN_MESSAGE.IMAGES_ITEM_MUST_BE_ARRAY_STRING)
      }
      return true
    }
  }
}

const productIdsSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ADMIN_MESSAGE.PRODUCT_IDS_IS_REQUIRED
  },
  isArray: {
    errorMessage: ADMIN_MESSAGE.PRODUCT_IDS_MUST_BE_ARRAY
  },
  custom: {
    options: (value: string[]) => {
      if (value.length > 0 && !value.every((item) => typeof item === 'string')) {
        throw new Error(ADMIN_MESSAGE.PRODUCT_IDS_ITEM_MUST_BE_ARRAY_STRING)
      }
      return true
    }
  }
}

const slugSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.SLUG_MUST_BE_STRING
  },
  isLength: {
    options: {
      min: 1,
      max: 500
    },
    errorMessage: ADMIN_MESSAGE.SLUG_LENGTH
  },
  trim: true
}

const nameSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.NAME_PRODUCT_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 500
    },
    errorMessage: ADMIN_MESSAGE.NAME_PRODUCT_LENGTH
  }
}

const priceSchema: ParamSchema = {
  isInt: {
    errorMessage: ADMIN_MESSAGE.PRICE_PRODUCT_MUST_BE_INT
  },
  toInt: true,
  custom: {
    options: (value: number) => {
      if (typeof value !== 'number') {
        throw new Error(ADMIN_MESSAGE.PRICE_PRODUCT_MUST_BE_NUMBER)
      }
      if (Number(value) < 1) {
        throw new Error(ADMIN_MESSAGE.PRICE_PRODUCT_GREATER_THAN_1)
      }
      return true
    }
  }
}

const priceBeforeDiscountSchema: ParamSchema = {
  custom: {
    options: (value: number, { req }) => {
      if (typeof value !== 'number') {
        throw new Error(ADMIN_MESSAGE.PRICE_BEFORE_DISCOUNT_MUST_BE_NUMBER)
      }
      if (Number(value) < Number(req.body.price)) {
        throw new Error(ADMIN_MESSAGE.PRICE_BEFORE_DISCOUNT_MUST_BE_GREATER_THAN_PRICE)
      }
      return true
    }
  }
}

const quantitySchema: ParamSchema = {
  custom: {
    options: (value: number) => {
      if (typeof value !== 'number') {
        throw new Error(ADMIN_MESSAGE.PRODUCT_QUANTITY_MUST_BE_NUMBER)
      }
      if (Number(value) < 1) {
        throw new Error(ADMIN_MESSAGE.PRODUCT_QUANTITY_GREATER_THAN_1)
      }
      return true
    }
  }
}

const soldSchema: ParamSchema = {
  custom: {
    options: (value: number) => {
      if (typeof value !== 'number') {
        throw new Error(ADMIN_MESSAGE.PRODUCT_SOLD_MUST_BE_NUMBER)
      }
      if (Number(value) < 1) {
        throw new Error(ADMIN_MESSAGE.PRODUCT_SOLD_GREATER_THAN_1)
      }
      return true
    }
  }
}

const viewSchema: ParamSchema = {
  custom: {
    options: (value: number) => {
      if (typeof value !== 'number') {
        throw new Error(ADMIN_MESSAGE.PRODUCT_VIEW_MUST_BE_NUMBER)
      }
      if (Number(value) < 1) {
        throw new Error(ADMIN_MESSAGE.PRODUCT_VIEW_GREATER_THAN_1)
      }
      return true
    }
  }
}
const ratingSchema: ParamSchema = {
  custom: {
    options: (value: number) => {
      if (value && typeof value !== 'number') {
        throw new Error(ADMIN_MESSAGE.PRODUCT_RATING_IS_NUMBER)
      }
      if (Number(value) < 1 || Number(value) > 5) {
        throw new Error(ADMIN_MESSAGE.PRODUCT_RATING_INVALID)
      }
      return true
    }
  }
}

const descriptionSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.PRODUCT_DESCRIPTION_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 5000
    },
    errorMessage: ADMIN_MESSAGE.PRODUCT_DESCRIPTION_LENGTH
  }
}

const seoTitleSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.SEO_TITLE_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 1000
    },
    errorMessage: ADMIN_MESSAGE.SEO_TITLE_LENGTH
  },
  optional: true
}

const seoKeywordsSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.SEO_KEYWORDS_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 2000
    },
    errorMessage: ADMIN_MESSAGE.SEO_KEYWORDS_LENGTH
  },
  optional: true
}

const seoDescriptionSchema: ParamSchema = {
  isString: {
    errorMessage: ADMIN_MESSAGE.SEO_DESCRIPTION_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 5000
    },
    errorMessage: ADMIN_MESSAGE.SEO_DESCRIPTION_LENGTH
  },
  optional: true
}

/* Declare functional schema */
export const createAdminProductValidator = validate(
  checkSchema(
    {
      category: {
        ...categorySchema,
        optional: true,
        trim: true
      },
      image: {
        ...imageSchema,
        trim: true,
        optional: true
      },
      images: {
        ...imagesSchema,
        trim: true,
        optional: true
      },
      slug: {
        ...slugSchema,
        notEmpty: {
          errorMessage: ADMIN_MESSAGE.SLUG_IS_REQUIRED
        },
        custom: {
          options: async (value: string) => {
            if (!REGEX_SLUG.test(value)) {
              throw new Error(ADMIN_MESSAGE.SLUG_INVALID)
            }
            try {
              const isSlug = await adminProductsService.checkSlugExist(value)
              if (isSlug) {
                throw new Error(ADMIN_MESSAGE.SLUG_ALREADY_EXISTS)
              }
              return true
            } catch (error) {
              throw error
            }
          }
        }
      },
      name: nameSchema,
      price: {
        ...priceSchema,
        notEmpty: {
          errorMessage: ADMIN_MESSAGE.PRICE_PRODUCT_IS_REQUIRED
        },
        trim: true
      },
      price_before_discount: {
        ...priceBeforeDiscountSchema,
        trim: true,
        optional: true
      },
      quantity: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGE.PRODUCT_QUANTITY_IS_REQUIRED
        },
        ...quantitySchema,
        trim: true
      },
      sold: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGE.PRODUCT_SOLD_IS_REQUIRED
        },
        ...soldSchema,
        trim: true
      },
      view: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGE.PRODUCT_VIEW_IS_REQUIRED
        },
        ...viewSchema,
        trim: true
      },
      rating: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGE.PRODUCT_RATING_IS_REQUIRED
        },
        ...ratingSchema,
        trim: true
      },
      description: {
        ...descriptionSchema,
        optional: true
      },
      seo_title: seoTitleSchema,
      seo_keywords: seoKeywordsSchema,
      seo_description: seoDescriptionSchema
    },
    ['body']
  )
)

export const updateAdminProductValidator = validate(
  checkSchema({
    product_id: productIdSchema,
    category: {
      ...categorySchema,
      optional: true,
      trim: true
    },
    image: {
      ...imageSchema,
      trim: true,
      optional: true
    },
    images: {
      ...imagesSchema,
      trim: true,
      optional: true
    },
    slug: {
      ...slugSchema,
      notEmpty: {
        errorMessage: ADMIN_MESSAGE.SLUG_IS_REQUIRED
      },
      custom: {
        options: async (value: string, { req }) => {
          if (!REGEX_SLUG.test(value)) {
            throw new Error(ADMIN_MESSAGE.SLUG_INVALID)
          }
          try {
            const product_id = req.body.product_id as string
            if (product_id) {
              const productsByProductId = await databasesService.products
                .find({
                  _id: {
                    $ne: new ObjectId(product_id)
                  }
                })
                .toArray()
              const isSlug = productsByProductId.some((item) => item.slug === value)
              if (isSlug) {
                throw new Error(ADMIN_MESSAGE.SLUG_ALREADY_EXISTS)
              }
            }
            return true
          } catch (error) {
            throw error
          }
        }
      },
      optional: true
    },
    name: {
      ...nameSchema,
      optional: true
    },
    price: {
      ...priceSchema,
      notEmpty: {
        errorMessage: ADMIN_MESSAGE.PRICE_PRODUCT_IS_REQUIRED
      },
      trim: true,
      optional: true
    },
    price_before_discount: {
      ...priceBeforeDiscountSchema,
      trim: true,
      optional: true
    },
    quantity: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGE.PRODUCT_QUANTITY_IS_REQUIRED
      },
      ...quantitySchema,
      trim: true,
      optional: true
    },
    sold: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGE.PRODUCT_SOLD_IS_REQUIRED
      },
      ...soldSchema,
      trim: true,
      optional: true
    },
    view: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGE.PRODUCT_VIEW_IS_REQUIRED
      },
      ...viewSchema,
      trim: true,
      optional: true
    },
    rating: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGE.PRODUCT_RATING_IS_REQUIRED
      },
      ...ratingSchema,
      trim: true,
      optional: true
    },
    description: {
      ...descriptionSchema,
      optional: true
    },
    seo_title: seoTitleSchema,
    seo_keywords: seoKeywordsSchema,
    seo_description: seoDescriptionSchema
  })
)
export const readDetailAdminProductValidator = validate(
  checkSchema(
    {
      product_id: productIdSchema
    },
    ['params']
  )
)

export const deleteAdminProductValidator = validate(
  checkSchema(
    {
      product_ids: productIdsSchema
    },
    ['body']
  )
)

export const adminProductPaginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        custom: {
          options: (value) => {
            const number = Number(value)
            if (number < 1 || number > 100) {
              throw new Error('Limit from 1 to 100')
            }
            return true
          }
        },
        optional: true
      },
      page: {
        isNumeric: true,
        custom: {
          options: (value) => {
            const number = Number(value)
            if (number < 1) {
              throw new Error('Page > 0')
            }
            return true
          }
        },
        optional: true
      }
    },
    ['query']
  )
)
