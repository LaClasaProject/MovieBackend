import Path from '../../base/Path'
import {
  HttpReq,
  IAddVideoProps,
  IRoute
 } from '../../Types'

import Utils from '../../Utils'

class UpdateVideoData extends Path implements IRoute {
  public path   = '/api/admin/:id'
  public method = 'patch'

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as IAddVideoProps,
      adminKey = req.headers.authorization

    if (!this.server.config.adminKeys.includes(adminKey))
      return {
        code: 401,
        message: 'Unauthorized request.'
      }

    return await Utils.updateVideoData(
      this.server,
      req.params.id ?? '',
      data
    )
  }
}

export default UpdateVideoData