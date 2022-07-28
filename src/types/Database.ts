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
}

interface IPlaylist {
  videoId: string
  pinned?: boolean

  public?: boolean
}

interface IUser {
  password: string
  email: string
  
  playlists: IPlaylist[]
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
  IPlaylist
}