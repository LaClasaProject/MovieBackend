interface ISeriesData {
  seasons: number
  episodes: IEpisodeData[][]
}

interface IEpisodeData {
  title: string
  desc?: string

  thumbnail?: string
}

interface IVideoMeta {
  title: string
  desc?: string
}

interface ITrailerData {
  show?: boolean
  url: string
}

interface ILockData {
  until: number
  hide?: boolean
}

interface IVideoImageData {
  poster: string
  thumbnail: string

  cover?: string
}

interface IVideoMiscData {
  video?: string
  subs?: string

  pinned?: boolean
  upcoming?: boolean
}

interface IVideoData {
  addedAt?: number
  available?: boolean

  series?: ISeriesData
  meta: IVideoMeta

  trailer?: ITrailerData
  lock?: ILockData
  
  runtime?: number
  images?: IVideoImageData

  misc?: IVideoMiscData
  badges: string[]

  requests: number
}

interface ILibraryContent {
  videoId: string
  public?: boolean
}

enum IUserTiers {
  FREE,
  PREM_1,
  PREM_2,
  ADMIN
}

interface IPaymentData {
  name: string
  id: string

  email: string
  tier: IUserTiers

  purchasedAt: number
}

interface IUser {
  username: string
  username_l: string

  email: string
  password: string
  
  library: ILibraryContent[]
  tier: IUserTiers

  _id?: string
  state: number

  payments: IPaymentData[] // list of completed payments
  tierExpir: number
}

export {
  ISeriesData,
  IEpisodeData,

  IVideoMeta,
  ITrailerData,

  ILockData,
  IVideoData,

  IVideoImageData,
  IVideoMiscData,

  IUser,
  ILibraryContent,

  IUserTiers,
  IPaymentData
}