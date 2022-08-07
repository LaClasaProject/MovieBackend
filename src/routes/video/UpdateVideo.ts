import Path from '../../base/Path'
import {
  HttpReq,
  INewVideoProps,
  IRoute
} from '../../types/Http'

class UpdateVideo extends Path implements IRoute {
  public path   = '/api/video/:id'
  public method = 'patch'

  public adminOnly = true

  public async onRequest(req: HttpReq) {
    const id = req.params.id,
      data = req.body as unknown as INewVideoProps,
      res = await this.server.utils.updateVideo(id, data)

    return res ? (
      {
        value: res,
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

export default UpdateVideo