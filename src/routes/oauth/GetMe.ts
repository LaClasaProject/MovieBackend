import Path from '../../base/Path'
import {
  HttpReq,
  IDecodedJwtToken,
  IRoute
} from '../../Types'

import Utils from '../../utils'
import DiscordOauthMethods from '../../utils/oauth/Discord'

class DiscordOauthToken extends Path implements IRoute {
  public path   = '/oauth/@me'
  public method = 'get'

  public async onRequest(req: HttpReq) {
    // jwt token must be in authorization header
    const encodedJwt = req.headers.authorization,
      token = await Utils.decryptJWT<IDecodedJwtToken>(encodedJwt)

    if (!token)
      return {
        code: 400,
        message: 'invalid jwt token provided.'
      }

    switch (token.type) {
      case 'discord_oauth':
        return await DiscordOauthMethods.GetMe(token)

      default:
        return {
          code: 400,
          message: 'unsupported oauth token type.'
        }
    }
  }
}

export default DiscordOauthToken