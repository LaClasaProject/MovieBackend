import HttpServer from './base/HttpServer'
import { INewVideoProps } from './types/Http'

// V2 Utils
class Utils {
  constructor(public server: HttpServer) {}

  public async getVideoById(_id: string) {
    return await this.server.models.Videos.findById(_id)
  }

  public async getVideos(
    options?: {
      skip: number,
      limit: number,
      pinned?: boolean,
      upcoming?: boolean,
      recentlyAdded?: boolean
    }
  ) {
    const filter: { [key: string]: any } = {}
    
    if (options?.pinned && options?.upcoming)
      filter.$or = [
        { 'misc.pinned': true },
        { 'misc.upcoming': true }
      ]
    else if (options?.pinned)
      filter['misc.pinned'] = true
    else if (options?.upcoming)
      filter['misc.upcoming'] = true

    if (options?.recentlyAdded) { // set filters explicitly
      filter.available = true
      options.limit = 5

      options.skip = 0
    }
      
    const videos = await this.server.models.Videos.find(
        filter,
        undefined
      )
      .skip(options?.skip)
      .limit(options?.limit)
      .sort(
        { addedAt: -1 }
      )

    return videos
  }

  public async addVideo(data: INewVideoProps) {
    const video = new this.server.models.Videos(
      {
        ...data,
        addedAt: Date.now()
      }
    )

    await video.save()
    return video
  }

  public async updateVideo(_id: string, data: INewVideoProps) {    
    return await this.server.models.Videos.findByIdAndUpdate(
      _id,
      data,
      { new: true }
    )
  }
  
  public async replaceVideo(_id: string, data: INewVideoProps) {    
    return await this.server.models.Videos.findOneAndReplace(
      { _id },
      data,
      { new: true }
    )
  }

  public async deleteVideo(_id: string) {
    return await this.server.models.Videos.findByIdAndDelete(_id)
  }

  public async getContent() {
    const otherVideos = await this.getVideos(
      {
        pinned: true,
        upcoming: true,
        skip: 0,
        limit: 0
      }
    ),
      mainVideos = await this.getVideos()

    return {
      otherVideos,
      mainVideos
    }
  }

  public async searchByTitle(title: string = '') {
    return await this.server.models.Videos.find(
      {
        'meta.title': new RegExp(title, 'gi')
      }
    )
  }
}

export default Utils