import Path from '../../base/Path'
import { 
  IWebAccount,
  WebAccountKeys
} from '../../Responses'

import {
  HttpReq,
  IDecodedJwtToken,
  IRoute
} from '../../Types'
import Utils from '../../utils'

class GetWebUser extends Path implements IRoute {
  public path   = '/api/user'
  public method = 'get'
  
  public async onRequest(req: HttpReq) {
    const encryptedJwt = req.headers.authorization,
      token = await Utils.decryptJWT<IDecodedJwtToken>(encryptedJwt)

    if (!token)
      return {
        code: 400,
        message: 'invalid jwt token provided.'
      }

    const query =
      await this.server.db.select<IWebAccount[]>(...WebAccountKeys)
        .from(this.server.config.db.table)
        .where(
          'AccountId',
          token.accountId
        )
        .first()

    return {
      data: query,
      code: 200
    }
  }
}

export default GetWebUser