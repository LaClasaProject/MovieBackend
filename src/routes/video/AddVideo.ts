import Path from '../../base/Path'
import {
  HttpReq,
  IRoute,
  INewVideoProps
} from '../../types/Http'

class AddVideo extends Path implements IRoute {
  public path   = '/api/videos'
  public method = 'post'

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as INewVideoProps,
      adminKey = req.headers.authorization

    if (!this.server.config.adminKeys.includes(adminKey))
      return {
        error: true,
        message: 'You aren not authorized for this action.',
        code: 401
      }

    return await this.server.utils.addVideo(data)
  }
}

export default AddVideo