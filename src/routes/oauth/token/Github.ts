import Path from '../../../base/Path'
import { HttpReq, IGithubAccessToken, IRoute } from '../../../Types'

import axios from 'axios'
import Utils from '../../../utils'

class GithubOauthToken extends Path implements IRoute {
  public path   = '/token/github/:code'
  public method = 'all' // keep it like this for now

  public async onRequest(req: HttpReq) {
    const { code } = req.params

    if (!code)
      throw new Error('invalid github oauth code.')

    const githubOauth = this.server.config.oauth.github
    let res

    try {
      res = await axios.post(
        githubOauth.endpoint +
          '/login/oauth/access_token?' + (
            new URLSearchParams(
              {
                client_id: githubOauth.clientId,
                client_secret: githubOauth.clientSecret,
                code,
                redirect_uri: githubOauth.redirect_uri,
              }
            ).toString()
          ),
        null,
        {
          headers: {
            Accept: 'application/json'
          }
        }
      )
      
      if (res.data.error)
        return {
          code: 400,
          message: `[${res.data.error}]: ${res.data.error_description}`
        }
    } catch(err) {
      return {
        code: 400,
        message: 'an error occurred.'
      }
    }
    
    const data: IGithubAccessToken = res.data
    const githubUser = await axios.get(
      githubOauth.otherEndpoint +
        '/user',
      {
        headers: {
          Authorization: 'token ' + data.access_token
        }
      }
    )

    // create new entry in database
    const accountId = await Utils.oAuthNewAccountEntry(
        this.server.db,
        {
          idColumn: 'GithubId',
          userId: githubUser.data.id?.toString()
        }
      ),
      token = await Utils.encryptJWT(
        {
          oauth: data,
          type: 'github_oauth',
          accountId
        },
        this.server.config.jwt_default_expiry
      )

    return {
      code: 200,
      data: token
    }
  }
}

export default GithubOauthToken