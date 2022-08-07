import Path from '../../base/Path'
import {
  HttpReq,
  IRoute,
  INewVideoProps
} from '../../types/Http'

class AddVideo extends Path implements IRoute {
  public path   = '/api/videos'
  public method = 'post'

  public adminOnly = true

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as INewVideoProps

    return {
      value: await this.server.utils.addVideo(data),
      code: 200
    }
  }
}

export default AddVideo