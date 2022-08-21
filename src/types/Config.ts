import { IUserTiers } from './Database'

interface IDatabaseConfig {
  host: string
  port: number | string

  user: string
  pass: string

  authSource: string
  dbName: string
}

interface IHttpConfig {
  port: number
  cleanedJsonResponses: boolean
}

interface ICaptchaConfig {
  sitekey: string
  secret: string
}

interface IPlan {
  price: number
  name: string

  tier: IUserTiers
  features: string[]
}

interface IPaypalConfig {
  base: string
  currencyCode: string
  
  clientID: string
  appSecret: string
}

interface IConfig {
  http: IHttpConfig
  db: IDatabaseConfig

  adminKeys: string[]
  captcha: ICaptchaConfig

  cypher_iv_key: string
  jwt_secret: string
  
  plans: IPlan[]
  paypal: IPaypalConfig
}

export {
  IDatabaseConfig,
  IHttpConfig,

  ICaptchaConfig,
  IConfig
}