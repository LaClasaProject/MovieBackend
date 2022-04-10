import Path from '../../base/Path'
import {
  HttpReq,
  IDecodedJwtToken,
  IRoute
} from '../../Types'

import Utils from '../../utils'

class SetWebUsername extends Path implements IRoute {
  public path   = '/api/user/name'
  public method = 'post'
  
  public async onRequest(req: HttpReq) {
    // request is valited via headers
    const encodedJwt = req.headers.authorization,
      token = await Utils.decryptJWT<IDecodedJwtToken>(encodedJwt),
      { username } = req.body as any

    if (!token)
      return {
        code: 400,
        message: 'invalid jwt token provided.'
      }

    const res = await Utils.setAccountUsername(
      this.server.db,
      {
        accountId: token.accountId,
        username
      }
    )

    if (!res.success)
      return {
        code: 400,
        message: res.message
      }
    else
      return { code: 200 }
  }
}

export default SetWebUsername