import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

class CaptureOrder extends Path implements IRoute {
  public path   = '/api/order/:id'
  public method = 'post'

  public async onRequest(req: HttpReq) {
    const { id: orderID } = req.params,
      res = await this.server.utils.paypalCaptureOrder(orderID)

    return {
      value: res,
      code: 200
    }
  }
}

export default CaptureOrder