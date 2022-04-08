import Path from '../../../base/Path'
import { HttpReq, IDiscordAccessToken, IRoute } from '../../../Types'

import axios from 'axios'
import Utils from '../../../utils'

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
            redirect_uri: discordOauth.redirect_uri,
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
    const account = await Utils.oAuthNewAccountEntry(
        this.server.db,
        {
          idColumn: 'DiscordId',
          userId: discordUser.data.id
        }
      ),
      token = await Utils.encryptJWT(
        {
          oauth: data,
          type: 'discord_oauth',
          accountId: account.accountId
        },
        data.expires_in
      )


    return {
      code: 200,
      data: {
        token,
        isNew: account.isNew
      }
    }
  }
}

export default DiscordOauthToken