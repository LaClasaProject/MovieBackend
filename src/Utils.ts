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
      limit: number
    }
  ) {
    return await this.server.models.Videos.find(
      {},
      undefined,
      options
    )
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

  // This should change daily, hence a cache is needed
  public async getTop5Videos() {
    /*
      Code for generating top 5 videos.
      Not used for now unless syncing between other backends is added.

       // get videos that are not in the top5 yet
      const nonTop5Videos = await this.server.models.Videos.find(
        { 'misc.isTop5': { $ne: true } }
      ),
        top5 = nonTop5Videos.sort(
            () => 0.5 - Math.random()
          )
          .slice(0, 5)

      // remove them from being top5
      await this.server.models.Videos.updateMany(
        { 'misc.isTop5': true },
        { 'misc.isTop5': false }
      )

      // set new top 5 in database
      for (const video of top5) {
        await video.updateOne(
          { 'misc.isTop5': true },
          { new: true }
        )
      }

      // place data in cache
      const tomorrow = (
        new Date()
      ).setHours(24, 0, 0, 0)

      this.server.top5Cache = { expir: tomorrow, data: top5 }
      return this.server.top5Cache.data
    */

    return await this.server.models.Videos.find(
      { 'misc.isTop5': true }
    )
  }

  public async getPinnedVideos() {
    return await this.server.models.Videos.find(
      { 'misc.pinned': true }
    )
  }
}

export default Utils