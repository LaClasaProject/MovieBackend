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
  clientId: string
  clientSecret: string
  redirect_uri: string
  scopes: string
  endpoint: string
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
  admin_key: string,

  cypher_iv_key: string
}

interface IEncryptedToken {
  iv: string
  token: string
}

// stuff for possible types for decrypt jwt
interface IDecodedJwtTokenDiscordData {
  type: 'discord_oauth'
  oauth: IDiscordAccessToken
  accountId: string
}

interface IDecodedJwtTokenGoogleData {
  type: 'google_oauth'
  accountId: string
}

type IDecodedJwtToken = IDecodedJwtTokenDiscordData | IDecodedJwtTokenGoogleData

export {
  IRoute,
  IConfig,

  IHttpConfig,
  IDatabaseConfig,

  HttpReq,
  HttpRes,

  PathReturnable,
  IDiscordAccessToken,

  IEncryptedToken,
  IDecodedJwtToken,

  IDecodedJwtTokenDiscordData,
  IDecodedJwtTokenGoogleData
}