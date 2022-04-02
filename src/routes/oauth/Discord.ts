import Path from '../../base/Path'
import { HttpReq, IDiscordAccessToken, IRoute } from '../../Types'

import axios from 'axios'
import Utils from '../../Utils'

class DiscordOauthToken extends Path implements IRoute {
  public path   = '/token/discord/:code'
  public method = 'all' // keep it like this for now

  public async onRequest(req: HttpReq) {
    const { code } = req.params

    if (!code)
      throw new Error('invalid discord oauth code.')

    const discordOauth = this.server.config.oauth.discord
    let res

    try {
      res = await axios.post(
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
    } catch(err) {
      return {
        code: 400,
        message: err?.response?.data?.error_description || 'invalid code provided.'
      }
    }

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

    // create new entry in database
    const matchUsers = await this.server.db.select<
      ({
        DiscordId: string,
        AccountId: string
      })[]
    >(
        [
          'DiscordId',
          'AccountId'
        ]
      )
      .from('web')
      .where(
        'DiscordId',
        discordUser.data.id
      )

    let accountId: string

    if (matchUsers.length < 1)
      await this.server.db('web')
      .insert(
        {
          AccountId: accountId = await Utils.generateUUID(),
          DiscordId: discordUser.data.id
        }
      )
    else
      accountId = matchUsers[0].AccountId

    const token = await Utils.encryptJWT(
      {
        oauth: data,
        type: 'discord_oauth',
        accountId
      },
      data.expires_in
    )

    return {
      code: 200,
      data: token
    }
  }
}

export default DiscordOauthToken