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

  adminKeys: string[]
}

interface IVideoData {
  VideoId: string
  IsSeries: boolean

  MetaTitle: string
  MetaDesc: string

  Seasons?: number
  Episodes?: Buffer | Array<number> // 1 byte = 1 season containing amount of episodes, e.g Buffer <07>

  PosterUrl?: string
  CoverUrl?: string

  IsAvailable: boolean
  VideoUrl?: string

  AddedAt: number
  SubtitlePath?: string
}

interface IAddVideoProps {
  title: string
  description: string

  isSeries?: boolean
  isAvailable?: boolean

  poster?: string
  cover?: string

  seasons?: number
  episodes?: number[]

  video?: string
  subs?: string
}

export {
  IRoute,
  IConfig,

  IHttpConfig,
  IDatabaseConfig,

  HttpReq,
  HttpRes,

  PathReturnable,
  IVideoData,

  IAddVideoProps
}
