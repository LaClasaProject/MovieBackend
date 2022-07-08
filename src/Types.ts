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

interface IHttpConfig {
  port: number
  cleanedJsonResponses: boolean
}

interface IConfig {
  http: IHttpConfig
  db: IDatabaseConfig
}

interface IVideoData {
  VideoId: string
  IsSeries: boolean

  MetaTitle: string
  MetaDesc: string

  Seasons?: number
  Episodes?: Buffer // 1 byte = 1 season containing amount of episodes, e.g Buffer <07>

  PosterUrl?: string
  CoverUrl?: string

  IsAvailable: boolean
}

export {
  IRoute,
  IConfig,

  IHttpConfig,
  IDatabaseConfig,

  HttpReq,
  HttpRes,

  PathReturnable,
  IVideoData
}