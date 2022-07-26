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
  }
}

export default AddVideo