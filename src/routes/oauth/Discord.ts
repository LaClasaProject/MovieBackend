import Path from '../../base/Path'
import { HttpReq, IDiscordAccessToken, IRoute } from '../../Types'

import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'

import Utils from '../../Utils'

class DiscordOauthToken extends Path implements IRoute {
  public path   = '/token/discord/:code'
  public method = 'get'

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
    const discordUser = await axios.get(
      discordOauth.endpoint +
        '/users/@me',
      {
        headers: {
          Authorization: 'Bearer ' + data.access_token
        }
      }
    )

    const token = await Utils.encryptJWT(
      {
        oauth: data,
        type: 'discord_oauth',
        id: discordUser.data.id
      },
      data.expires_in
    )

    // create new entry in database
    const count = await Utils.countValueInColumn(
      this.server.db,
      {
        table: 'web',
        column: 'DiscordId',
        value: discordUser.data.id
      }
    )

    if (count < 1) 
      await this.server.db('web')
      .insert(
        {
          AccountId: await Utils.generate32ByteId(),
          DiscordId: discordUser.data.id
        }
      )

    await Utils.decryptJWT(token)

    return {
      code: 200,
      data: token
    }
  }
}

export default DiscordOauthToken