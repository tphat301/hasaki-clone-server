import { config } from 'dotenv'
import argv from 'minimist'
import type { StringValue } from 'ms'

const options = argv(process.argv.slice(2))

export const isProduction = options.env === 'production'

config({ path: isProduction ? `.env.${options.env}` : '.env' })

export const CONFIG_ENV = {
  PORT: process.env.PORT,
  SERVER_URL: process.env.SERVER_URL as string,
  CLIENT_URL: process.env.CLIENT_URL as string,
  DB_NAME: process.env.DB_NAME as string,
  DB_USERNAME: process.env.DB_USERNAME as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  MAIL_HOST: process.env.MAIL_HOST as string,
  MAIL_PORT: process.env.MAIL_PORT as string,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME as string,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD as string,
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS as string,
  ADMIN_SECRET_PASSKEY: process.env.ADMIN_SECRET_PASSKEY as string,
  DB_COLLECTION_USERS: process.env.DB_COLLECTION_USERS as string,
  DB_COLLECTION_ADMINS: process.env.DB_COLLECTION_ADMINS as string,
  DB_COLLECTION_PRODUCTS: process.env.DB_COLLECTION_PRODUCTS as string,
  DB_COLLECTION_CATEGORY_PRODUCTS: process.env.DB_COLLECTION_CATEGORY_PRODUCTS as string,
  DB_COLLECTION_PURCHASES: process.env.DB_COLLECTION_PURCHASES as string,
  DB_COLLECTION_REFRESH_TOKENS: process.env.DB_COLLECTION_REFRESH_TOKENS as string,
  JWT_ACCESS_TOKEN_SECRET_KEY: process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
  JWT_REFRESH_TOKEN_SECRET_KEY: process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string,
  JWT_EMAIL_VERIFY_TOKEN_SECRET_KEY: process.env.JWT_EMAIL_VERIFY_TOKEN_SECRET_KEY as string,
  JWT_FORGOT_PASSWORD_TOKEN_SECRET_KEY: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET_KEY as string,
  PASSWORD_SECRET_KEY: process.env.PASSWORD_SECRET_KEY as string,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue,
  JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as StringValue,
  JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN: process.env.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue,
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN: process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN as StringValue,
  JWT_ADMIN_ACCESS_TOKEN_SECRET_KEY: process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET_KEY as string,
  JWT_ADMIN_REFRESH_TOKEN_SECRET_KEY: process.env.JWT_ADMIN_REFRESH_TOKEN_SECRET_KEY as string,
  JWT_ADMIN_EMAIL_VERIFY_TOKEN_SECRET_KEY: process.env.JWT_ADMIN_EMAIL_VERIFY_TOKEN_SECRET_KEY as string,
  JWT_ADMIN_FORGOT_PASSWORD_TOKEN_SECRET_KEY: process.env.JWT_ADMIN_FORGOT_PASSWORD_TOKEN_SECRET_KEY as string,
  JWT_ADMIN_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ADMIN_ACCESS_TOKEN_EXPIRES_IN as StringValue,
  JWT_ADMIN_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_ADMIN_REFRESH_TOKEN_EXPIRES_IN as StringValue,
  JWT_ADMIN_EMAIL_VERIFY_TOKEN_EXPIRES_IN: process.env.JWT_ADMIN_EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue,
  JWT_ADMIN_FORGOT_PASSWORD_TOKEN_EXPIRES_IN: process.env.JWT_ADMIN_FORGOT_PASSWORD_TOKEN_EXPIRES_IN as StringValue,
  SECRET_KEY_ACCEPT_ADMIN_REGITER_SITE: process.env.SECRET_KEY_ACCEPT_ADMIN_REGITER_SITE as string
} as const

export const CONFIG_PAGINATION = {
  PAGE: 1,
  LIMIT: 8
} as const
