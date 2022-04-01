import {
  HttpReq,
  IRoute,
  HttpRes,
  PathReturnable
} from '../Types'

import HttpServer from './HttpServer'

class Path implements IRoute {
  public path   = '/'
  public method = 'get'

  public server: HttpServer

  public register(server: HttpServer, log: boolean = false) {
    this.server = server

    server.restana[this.method](
      this.path,
      async (req: HttpReq, res: HttpRes) => {
        const result = await this.onRequest(req, res)
        
        switch (typeof result) {
          case 'object':
            res.send(
              JSON.stringify(result)
            )
            break

          case 'number':
            res.statusCode = result
            res.end()
            break

          case 'string':
            res.send(result)
            break

          default:
            res.statusCode = 500
            res.end()
            break
        }
      }
    )
  }

  public async onRequest(_req: HttpReq, _res: HttpRes): Promise<PathReturnable | void> {}
}

export default Path