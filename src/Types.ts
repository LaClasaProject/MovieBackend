import { IncomingMessage, ServerResponse } from 'http'
import { RequestExtensions, ResponseExtensions } from 'restana'

type HttpReq = IncomingMessage & RequestExtensions
type HttpRes = ServerResponse & ResponseExtensions

type PathReturnable = number | string | object | any[]

interface IRoute {
  path: string
  method: string
}

interface IDatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
}

interface IOAuthConfig {
  "clientId": string
  "clientSecret": string
  "redirect_uri": string
  "scopes": string
  "endpoint": string
}

interface IDiscordAccessToken {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

interface IHttpConfig {
  port: number
  cleanedJsonResponses: boolean
}

interface IConfig {
  http: IHttpConfig
  db: IDatabaseConfig

  oauth: {
    [key: string]: IOAuthConfig
  },

  jwt_secret: string
  admin_key: string
}

export {
  IRoute,
  IConfig,

  IHttpConfig,
  IDatabaseConfig,

  HttpReq,
  HttpRes,

  PathReturnable,
  IDiscordAccessToken
}