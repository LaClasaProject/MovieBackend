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

interface IVideoData {
  addedAt?: number
  available?: boolean

  series?: ISeriesData
  meta: IVideoMeta

  trailer?: ITrailerData
  lock?: ILockData
  
  runtime?: number
}

interface IUser {

}

export {
  ISeriesData,
  IEpisodeData,

  IVideoMeta,
  ITrailerData,

  ILockData,
  IVideoData
}