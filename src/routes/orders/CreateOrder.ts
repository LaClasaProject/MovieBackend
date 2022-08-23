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
      user = await this.server.utils.getUserByToken(this.token)

    if (user.tier && user.tierExpir > Date.now())
      return {
        error: true,
        message: 'You currently have a pending plan.',
        code: 400
      }

    return {
      value: await this.server.utils.paypalCreateOrder(this.token, tier || IUserTiers.PREM_1),
      code: 200
    }
  }
}

export default CreateOrder