import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

class DeleteVideo extends Path implements IRoute {
  public path   = '/api/video/:id'
  public method = 'delete'

  public adminOnly = true

  public async onRequest(req: HttpReq) {
    const id = req.params.id,
      data = await this.server.utils.deleteVideo(id)

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

export default DeleteVideo