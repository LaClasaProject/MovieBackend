// route usually for site only
import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

class GetContent extends Path implements IRoute {
  public path   = '/api/content'
  public method = 'get'

  public cache = true

  public async onRequest() {
    return {
      value: await this.server.utils.getContent(),
      code: 200
    }
  }
}

export default GetContent