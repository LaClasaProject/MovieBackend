import { IncomingMessage, ServerResponse } from 'http'
import { RequestExtensions, ResponseExtensions } from 'restana'

import {
  ILockData,
  ISeriesData,

  ITrailerData,
  IVideoImageData,
  
  IVideoMeta,
  IVideoMiscData
} from './Database'

type HttpReq = IncomingMessage & RequestExtensions
type HttpRes = ServerResponse & ResponseExtensions

interface IPathReturnObject {
  error?: boolean
  code?: number

  message?: string
  data?: any

  willPipe?: boolean
}

type PathReturnable = number | string | IPathReturnObject | any[]

interface IRoute {
  path: string
  method: string
}

interface INewVideoProps {
  available?: boolean
  series?: ISeriesData

  meta: IVideoMeta
  trailer?: ITrailerData

  lock?: ILockData
  runtime?: number

  images?: IVideoImageData
  misc?: IVideoMiscData
}

export {
  HttpReq,
  HttpRes,

  PathReturnable,
  IRoute,

  INewVideoProps,
  IPathReturnObject
}