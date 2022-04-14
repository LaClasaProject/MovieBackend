import Path from '../../base/Path'
import {
  HttpReq,
  IDecodedJwtToken,
  IRoute
} from '../../Types'

import Utils from '../../utils'

class LinkAccount extends Path implements IRoute {
  public path   = '/api/players/link'
  public method = 'post'
  
  // todo: add password verification
  public async onRequest(req: HttpReq) {
    const encryptedJwt = req.headers.authorization,
      token = await Utils.decryptJWT<IDecodedJwtToken>(encryptedJwt)

    if (!token)
      return {
        code: 400,
        message: 'invalid jwt token provided.'
      }

    const userId = Number(
        (req.body as any).userId
      ),
      password = (
        (req.body as any).password
          ?.toString()
      ),
      link = await Utils.linkAccount(
        this.server.db,
        token.accountId,
        userId,
        password
      )

    return {
      code: link.success ? 200 : 400,
      message: link.success ? '' : (
        link.message || 'failed to link account.'
      )
    }
  }
}

export default LinkAccount