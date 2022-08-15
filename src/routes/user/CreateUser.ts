import Path from '../../base/Path'
import { IUser } from '../../types/Database'

import {
  HttpReq,
  IRoute
} from '../../types/Http'

class CreateUser extends Path implements IRoute {
  public path   = '/api/users'
  public method = 'post'

  public captcha = true

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as IUser,
      { token } = req.query as any

    return {
      value: await this.server.utils.addUser(
        data,
        token === 'true'
      ),
      code: 200
    }
  }
}

export default CreateUser