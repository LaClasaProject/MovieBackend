import Path from '../../base/Path'
import { 
  IPartialUser,
  PartialUserKeys,
} from '../../Responses'

import {
  HttpReq,
  IDecodedJwtToken,
  IRoute
} from '../../Types'
import Utils from '../../utils'

class SearchPlayer extends Path implements IRoute {
  public path   = '/api/players/search/:username'
  public method = 'get'
  
  public async onRequest(req: HttpReq) {
    const { username } = req.params
    if (!username ||
        username.length < 3 ||
        username.length > 24)
      return {
        code: 400,
        message: 'invalid username provided.'
      }
    
    // for authorization only
    const encryptedJwt = req.headers.authorization,
      token = await Utils.decryptJWT<IDecodedJwtToken>(encryptedJwt)

    if (!token)
      return {
        code: 400,
        message: 'invalid jwt token provided.'
      }

    const users =
      await this.server.db.select<IPartialUser[]>(...PartialUserKeys)
        .from('Players')
        .where(
          'Username',
          'like',
          `%${username}%`
        )

    return {
      data: users,
      code: 200
    }
  }
}

export default SearchPlayer