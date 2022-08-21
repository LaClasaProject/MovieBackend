import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

class GetVideoById extends Path implements IRoute {
  public path   = '/api/video/:id'
  public method = 'get'
  
  public cache = true
  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const id = req.params.id,
      data = await this.server.utils.getVideoById(id)

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