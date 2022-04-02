import Path from '../../base/Path'
import { 
  IPartialUser,
  PartialUserKeys
} from '../../Responses'

import { HttpReq, IRoute } from '../../Types'

class GetUsers extends Path implements IRoute {
  public path   = '/admin/users'
  public method = 'get'
  
  public async onRequest(req: HttpReq) {
    const adminKey = req.headers.authorization
    if (adminKey !== this.server.config.admin_key)
      return {
        code: 401,
        message: 'unauthorized action taken'
      }

    const limit = Number(req.query.limit ?? 0)
    const query =
      this.server.db.select<IPartialUser[]>(...PartialUserKeys)
        .from('players')

    if (!isNaN(limit) && limit >= 1 && limit <= Number.MAX_SAFE_INTEGER)
      query.limit(limit)

    const users = await query

    return {
      data: users,
      code: 200
    }
  }
}

export default GetUsers