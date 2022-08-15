import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

class GetLibrary extends Path implements IRoute {
  public path   = '/api/users/library'
  public method = 'get'

  public requireUserToken = true

  public async onRequest() {
    return {
      value: await this.server.utils.getUserLibrary(this.token),
      code: 200
    }
  }
}

export default GetLibrary