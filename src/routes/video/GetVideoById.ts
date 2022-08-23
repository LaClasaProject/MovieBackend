import Path from '../../base/Path'
import { IUserTiers } from '../../types/Database'

import {
  HttpReq,
  IRoute
} from '../../types/Http'

class GetVideoById extends Path implements IRoute {
  public path   = '/api/video/:id'
  public method = 'get'
  
  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const id = req.params.id,
      data = await this.server.utils.getVideoById(id),
      user = await this.server.utils.getUserByToken(this.token)

    if (
      data.series && (
        user.tier < IUserTiers.PREM_1 ||
        Date.now() >= user.tierExpir
      )
    )
      return {
        error: true,
        message: 'You can only view this on premium mode.',
        code: 401
      }

    return data ? (
      {
        value: data,
        code: 200
      }
    ) : (
      {
        error: true,
        message: 'Video not found',
        code: 404
      }
    )
  }
}

export default GetVideoById