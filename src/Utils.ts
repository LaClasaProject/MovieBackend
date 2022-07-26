import HttpServer from './base/HttpServer'
import { INewVideoProps } from './types/Http'

// V2 Utils
class Utils {
  constructor(public server: HttpServer) {}

  public async getVideoById(_id: string) {
    return await this.server.models.Videos.findOne(
      { _id }
    )
  }

  public async getVideos() {
    return await this.server.models.Videos.find({})
  }

  // TODO: Add function
  public async addVideo(data: INewVideoProps) {
    return null
  }
}

export default Utils