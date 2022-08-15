import Path from '../../base/Path'

import {
  HttpReq,
  IRoute
} from '../../types/Http'

class VerifyToken extends Path implements IRoute {
  public path   = '/api/users/verify/:token'
  public method = 'get'

  public async onRequest(req: HttpReq) {
    const token = req.params.token,
      result = await this.server.utils.decryptJWT<any>(token)

    if (!result)
      return {
        error: true,
        message: 'JWT Token invalid.',
        code: 400,
        userTokenInvalid: true
      }
    else return {
      code: 200,
      message: 'JWT Token verified.'
    }
  }
}

export default VerifyToken