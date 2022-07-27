import { Schema, model } from 'mongoose'
import {
  ISeriesData,
  IEpisodeData,

  IVideoMeta,
  ITrailerData,

  ILockData,
  IVideoData
} from './types/Database'

const EpisodeSchema = new Schema<IEpisodeData>(
    {
      title: { type: Schema.Types.String, required: true },
      desc: Schema.Types.String,
    
      thumbnail: Schema.Types.String
    },
    {
      _id: false,
      versionKey: false
    }
  ),
  SeriesSchema = new Schema<ISeriesData>(
    {
      seasons: Schema.Types.Number,
      episodes: [
        [EpisodeSchema]
      ]
    },
    {
      _id: false,
      versionKey: false
    }
  ),
  MetaSchema = new Schema<IVideoMeta>(
    {
      title: { type: Schema.Types.String, required: true },
      desc: Schema.Types.String
    },
    {
      _id: false,
      versionKey: false
    }
  ),
  TrailerSchema = new Schema<ITrailerData>(
    {
      show: Schema.Types.Boolean,
      url: { type: Schema.Types.String, required: true }
    },
    {
      _id: false,
      versionKey: false
    }
  ),
  LockSchema = new Schema<ILockData>(
    {
      until: Schema.Types.Number,
      hide: Schema.Types.Boolean
    },
    {
      _id: false,
      versionKey: false
    }
  ),
  VideoSchema = new Schema<IVideoData>(
    {
      addedAt: { type: Schema.Types.Number, required: true },
      available: Schema.Types.Boolean,

      series: SeriesSchema,
      meta: { type: MetaSchema, required: true },

      trailer: TrailerSchema,
      lock: LockSchema,

      runtime: Schema.Types.Number
    },
    { versionKey: false }
  )

const models = {
  Videos: model('Videos', VideoSchema)
}

export default models