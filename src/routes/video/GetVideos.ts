import Path from '../../base/Path'
import { IRoute } from '../../Types'

import Utils from '../../Utils'

class GetVideos extends Path implements IRoute {
  public path   = '/api/videos'
  public method = 'get'

  public async onRequest() {
    return {
      data: await Utils.getVideos(this.server),
      code: 200
    }
  }
}

export default GetVideos
