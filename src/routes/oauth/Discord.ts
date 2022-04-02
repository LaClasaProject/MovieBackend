import Path from '../../base/Path'
import { HttpReq, IDiscordAccessToken, IRoute } from '../../Types'

import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'

class DiscordOauthToken extends Path implements IRoute {
  public path   = '/token/discord/:code'
  public method = 'post'

  public async onRequest(req: HttpReq) {
    const { code } = req.params

    if (!code)
      throw new Error('invalid discord oauth code.')

    const discordOauth = this.server.config.oauth.discord
    const res = await axios.post(
      discordOauth.endpoint +
        '/oauth2/token',
      new URLSearchParams(
        {
          client_id: discordOauth.clientId,
          client_secret: discordOauth.clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://localhost:3000/callback/discord'
        }
      ).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    const data: IDiscordAccessToken = res.data
    const token = jsonwebtoken.sign(
      data,
      this.server.config.jwt_secret,
      {
        expiresIn: data.expires_in
      }
    )

    // todo encrypt jwt token

    return {
      code: 200,
      data: token
    }
  }
}

export default DiscordOauthToken