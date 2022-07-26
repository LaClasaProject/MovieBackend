import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

class GetVideoById extends Path implements IRoute {
  public path   = '/api/v2/video/:id'
  public method = 'get'

  public async onRequest(req: HttpReq) {
    const id = req.params.id,
      data = await this.server.utils.getVideoById(id)

    return data ? (
      {
        data,
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