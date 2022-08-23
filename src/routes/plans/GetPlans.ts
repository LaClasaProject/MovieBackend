import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

class GetPlans extends Path implements IRoute {
  public path   = '/api/plans'
  public method = 'get'

  public cache = true

  public async onRequest() {
    return {
      value: this.server.config.plans,
      code: 200
    }
  }
}

export default GetPlans