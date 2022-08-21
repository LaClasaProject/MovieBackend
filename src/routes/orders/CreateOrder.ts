import Path from '../../base/Path'
import { IUserTiers } from '../../types/Database'

import {
  HttpReq,
  IRoute
} from '../../types/Http'

class CreateOrder extends Path implements IRoute {
  public path   = '/api/orders'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { tier } = req.body as unknown as { tier: IUserTiers },
      res = await this.server.utils.paypalCreateOrder(this.token, tier || IUserTiers.PREM_1)

    return {
      value: res,
      code: 200
    }
  }
}

export default CreateOrder