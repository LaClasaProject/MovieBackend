import Path from '../base/Path'
import {
  HttpReq,
  HttpRes,
  IRoute
} from '../Types'

class GetUsers extends Path implements IRoute {
  path   = '/users'
  method = 'get'
  
  public async onRequest(req: HttpReq, res: HttpRes) {
    console.log(this.server.routes)

    return 404
  }
}

export default GetUsers