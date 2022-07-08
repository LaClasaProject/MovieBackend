import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
 } from '../../Types'
import Utils from '../../Utils'

class GetVideoData extends Path implements IRoute {
  public path   = '/videos/:id'
  public method = 'get'

  public async onRequest(req: HttpReq) {
    const video = await Utils.getVideoData(
      this.server,
      req.params.id
    )

    return {
      data: video,
      code: 200
    }
  }
}

export default GetVideoData