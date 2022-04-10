import OauthBase from './Base'
import { IDecodedJwtTokenGithubData } from '../../Types'

import axios from 'axios'
import config from '../../../config.json'

class GithubOauthMethods extends OauthBase {

  // get current user data
  public static async GetMe(jwtToken: IDecodedJwtTokenGithubData) {
    
    try {
      const { data: user } = await axios.get(
        config.oauth.github.otherEndpoint +
          '/user',
        {
          headers: {
            Authorization: 'token ' + jwtToken.oauth.access_token 
          }
        }
      )

      return {
        code: 200,
        data: user
      }
    } catch(err) {
      // unauthorized
      return {
        code: 400,
        message: 'invalid bearer token provided.'
      }
    }
  }
}

export default GithubOauthMethods