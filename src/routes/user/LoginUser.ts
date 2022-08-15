// This route is to generate login ids
import Path from '../../base/Path'
import { IUser } from '../../types/Database'

import {
  HttpReq,
  IRoute
} from '../../types/Http'

class LoginUser extends Path implements IRoute {
  public path   = '/api/users/token'
  public method = 'post'

  public captcha = false

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as IUser,
      user = await this.server.utils.getUserByAuth(data.email, data.password)

    if (!user)
      return {
        error: true,
        message: 'User not found.',
        code: 400
      }
    else return {
      value: await this.server.utils.encryptJWT(
        { _id: user.id },
        60 * 60 * 24, // seconds
      ),
      code: 200
    }
  }
}

export default LoginUser