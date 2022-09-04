import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

class GetUser extends Path implements IRoute {
  public path   = '/api/user'
  public method = 'get'

  public requireUserToken = true

  public async onRequest() { 
    return {
      value: await this.server.utils.getUserByToken(this.token),
      code: 200
    }
  }
}

export default GetUser