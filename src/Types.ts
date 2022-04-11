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
  table: string
}

interface IOAuthConfig {
  clientId: string
  clientSecret: string
  redirect_uri: string
  scopes: string
  endpoint: string

  otherEndpoint?: string
}

interface IDiscordAccessToken {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

interface IGithubAccessToken {
  access_token: string
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
  jwt_default_expiry: number

  admin_key: string
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

interface IDecodedJwtTokenGithubData {
  type: 'github_oauth'
  oauth: IGithubAccessToken
  accountId: string
}

type OauthEntries = 'GoogleId' | 'DiscordId' | 'GithubId'

interface IOauthAccountEntry {
  idColumn: OauthEntries
  userId: string
}

interface IOauthAccountUpdate {
  accountId: string
  idColumn: OauthEntries
  userId: string
}

type IDecodedJwtToken = IDecodedJwtTokenDiscordData | IDecodedJwtTokenGoogleData | IDecodedJwtTokenGithubData

interface INewOauthAccountResponse {
  accountId: string
  isNew: boolean
}

interface ISetUsernameOptions {
  username: string
  accountId: string
}

interface ISetUsernameResponse {
  success: boolean
  message?: string
}

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
  IDecodedJwtTokenGoogleData,

  IOauthAccountEntry,
  IGithubAccessToken,

  IDecodedJwtTokenGithubData,
  INewOauthAccountResponse,

  ISetUsernameOptions,
  ISetUsernameResponse,

  OauthEntries,
  IOauthAccountUpdate
}