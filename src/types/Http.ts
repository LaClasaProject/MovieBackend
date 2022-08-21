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
  value?: any

  willPipe?: boolean
  userTokenInvalid?: boolean
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

interface IEncryptedToken {
  iv: string
  token: string
}

interface IPaypalAccessTokenResult {
  scope: string
  access_token: string

  token_type: string
  app_id: string

  expires_in: string
  nonce: string
}

interface IPaypalOrder {
  id: string
  status: string

  links: string[]
}

export {
  HttpReq,
  HttpRes,

  PathReturnable,
  IRoute,

  INewVideoProps,
  IPathReturnObject,

  IEncryptedToken,
  IPaypalAccessTokenResult,

  IPaypalOrder
}