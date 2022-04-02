import Path from '../../base/Path'
import { 
  IPartialUser,
  PartialUserKeys
} from '../../Responses'

import { HttpReq, IRoute } from '../../Types'

class GetUserById extends Path implements IRoute {
  public path   = '/admin/user/:id'
  public method = 'get'
  
  public async onRequest(req: HttpReq) {
    const adminKey = req.headers.authorization
    if (adminKey !== this.server.config.admin_key)
      return {
        code: 401,
        message: 'unauthorized action taken'
      }

    const id = Number(req.params.id)
    if (isNaN(id) || id > Number.MAX_SAFE_INTEGER || id < 1)
      throw new Error('invalid UserId was provided.')

    const user = await this.server.db.select<IPartialUser>(...PartialUserKeys)
      .from('players')
      .where('UserId', id)
      .first()

    return {
      data: user || null,
      code: 200
    }
  }
}

export default GetUserById