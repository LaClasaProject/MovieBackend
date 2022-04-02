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
        try {
          const result = await this.onRequest(req, res) as any
        
          switch (typeof result) {
            case 'object':
            if (typeof result.code === 'number')
              res.statusCode = result.code

              res.send(
                this.server.config.http.cleanedJsonResponses ?
                  JSON.stringify(result, null, 2) :
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
        } catch(err) {
          const data = {
            code: 500,
            message: err.isAxiosError ?
              `Internal API Error, please contact admins about this.` :
              err.message
          }

          res.statusCode = 500
          res.send(
            this.server.config.http.cleanedJsonResponses ?
              JSON.stringify(data, null, 2) :
              JSON.stringify(data)
          )
        }
      }
    )
  }

  public async onRequest(_req: HttpReq, _res: HttpRes): Promise<PathReturnable | void> {}
}

export default Path