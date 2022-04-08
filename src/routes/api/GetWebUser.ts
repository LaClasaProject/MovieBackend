import Path from '../../base/Path'
import { 
  IWebAccount,
  WebAccountKeys
} from '../../Responses'

import { HttpReq, IRoute } from '../../Types'

class GetWebUser extends Path implements IRoute {
  public path   = '/api/web_user/:id'
  public method = 'get'
  
  public async onRequest(req: HttpReq) {
    const accountId = req.params.id,
      query =
        await this.server.db.select<IWebAccount[]>(...WebAccountKeys)
          .from('web')
          .where(
            'AccountId',
            accountId
          )
          .first()

    return {
      data: query,
      code: 200
    }
  }
}

export default GetWebUser