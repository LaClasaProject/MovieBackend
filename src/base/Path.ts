import {
  HttpReq,
  IRoute,
  HttpRes,
  PathReturnable
} from '../types/Http'

import HttpServer from './HttpServer'

class Path implements IRoute {
  public path   = '/'
  public method = 'get'

  public adminOnly = false
  public server: HttpServer

  public register(server: HttpServer, log: boolean = false) {
    this.server = server

    server.restana[this.method](
      this.path,
      async (req: HttpReq, res: HttpRes) => {
        const adminKey = req.headers.authorization
        if (
          this.adminOnly &&
          !this.server.config.adminKeys.includes(adminKey)
        ) {
          const result = {
            error: true,
            message: 'You are unauthorized to visit this page.',
            code: 401
          }
          res.statusCode = result.code

          return res.send(
            this.server.config.http.cleanedJsonResponses ?
              JSON.stringify(result, null, 2) :
              JSON.stringify(result)
          )
        }

        try {
          const result = await this.onRequest(req, res) as any
        
          switch (typeof result) {
            case 'object':
              if (result === null) {
                const data = {
                  code: 400,
                  message: 'no message was provided'
                }
      
                res.statusCode = 400
                return res.send(
                  this.server.config.http.cleanedJsonResponses ?
                    JSON.stringify(data, null, 2) :
                    JSON.stringify(data)
                )
              }

              if (result.willPipe)
                break

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