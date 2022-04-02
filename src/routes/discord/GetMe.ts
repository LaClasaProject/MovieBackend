import Path from '../../base/Path'
import {
  HttpReq,
  IDecodedJwtTokenDiscordData,
  IRoute
} from '../../Types'

import Utils from '../../Utils'
import axios from 'axios'

class GetMe extends Path implements IRoute {
  public path   = '/discord/@me'
  public method = 'get'

  public async onRequest(req: HttpReq) {
    // jwt token must be in authorization header
    const encodedJwt = req.headers.authorization,
      jwtToken = await Utils.decryptJWT<IDecodedJwtTokenDiscordData>(encodedJwt)

    if (!jwtToken) // failed jwt token
      return {
        code: 400,
        message: 'invalid jwt token provided.'
      }

    try {
      const { data: user } = await axios.get(
        this.server.config.oauth.discord.endpoint +
          '/users/@me',
        {
          headers: {
            authorization: jwtToken.oauth.token_type + ' ' + jwtToken.oauth.access_token 
          }
        }
      )

      return {
        code: 200,
        data: user
      }
    } catch {
      // unauthorized
      return {
        code: 400,
        message: 'invalid bearer token provided.'
      }
    }
  }
}

export default GetMe