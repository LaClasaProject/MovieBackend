import OauthBase from './Base'
import { IDecodedJwtTokenDiscordData } from '../../Types'

import axios from 'axios'
import config from '../../../config.json'

class DiscordOauthMethods extends OauthBase {

  // get current user data
  public static async GetMe(jwtToken: IDecodedJwtTokenDiscordData) {
    try {
      const { data: user } = await axios.get(
        config.oauth.discord.endpoint +
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

export default DiscordOauthMethods