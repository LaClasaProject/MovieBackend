import {
  HttpReq,
  IRoute,
  HttpRes,
  PathReturnable,
  IPathReturnObject
} from '../types/Http'
import HttpServer from './HttpServer'

import zlib from 'zlib'
import { promisify } from 'util'

import axios from 'axios'
import { URLSearchParams } from 'url'

class Path implements IRoute {
  public path   = '/'
  public method = 'get'

  public adminOnly = false
  public server: HttpServer

  public deflate = promisify(zlib.deflate)
  public inflate = promisify(zlib.inflate)

  public cache = false
  public captcha = false

  public requireUserToken = false
  public token: string = null

  private clean(data: IPathReturnObject) {
    return this.server.config.http.cleanedJsonResponses ?
      JSON.stringify(data, null, 2) :
      JSON.stringify(data)
  }

  private async addToCache(url: string, data: IPathReturnObject) {
    if (!this.cache) return

    await this.server.log(url, 'not in cache. Now added.')
    this.server.cache.data.set(
      url,
      {
        expiry: Date.now() + (
          (this.server.cache.ttl * 1000) *
          60
        ),
        data: await this.deflate(
          JSON.stringify(data),
          { level: zlib.constants.Z_BEST_COMPRESSION }
        )
      }
    )
  }

  private async getFromCache(url: string): Promise<IPathReturnObject | undefined> {
    if (!this.cache) return

    const cached = this.server.cache.data.get(url)
    if (Date.now() >= cached?.expiry || 0) return

    return cached ? (
      JSON.parse(
        (
          await this.inflate(
            cached.data,
            { level: zlib.constants.Z_BEST_COMPRESSION }
          )
        ).toString()
      )
    ) : undefined
  }

  public register(server: HttpServer) {
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
            this.clean(result)
          )
        }

        if (this.requireUserToken) {
          const token = req.headers.authorization as string ?? '',
            isValid = await this.server.utils.verifyToken(token)

          if (!isValid) { // token failed
            const result = {
              error: true,
              message: 'User token provided is either invalid or expired.',
              code: 400,
              userTokenInvalid: true
            }
            res.statusCode = result.code

            return res.send(
              this.clean(result)
            )
          } else this.token = token
        }

        if (this.captcha) {
          const { captchaResponse } = req.body as unknown as { captchaResponse: string },
            reqURL = 'https://hcaptcha.com/siteverify',
            axiosRes = await axios.post(
              reqURL,
              new URLSearchParams(
                {
                  secret: this.server.config.captcha.secret,
                  response: captchaResponse,
                  sitekey: this.server.config.captcha.sitekey
                }
              ),
              {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
              }
            )

          delete req.body['captchaResponse']
          if (!axiosRes.data.success) {
            const result = {
              error: true,
              message: `Captcha failed. Errors: "${(axiosRes.data['error-codes'] ?? []).join('", "')}"`,
              code: 400
            }
            res.statusCode = result.code

            return res.send(
              this.clean(result)
            )
          }
        }

        try {
          const path = req.url,
            url = path.endsWith('/') && path.length > 1 ?
              path.slice(0, -1) :
              path,
              cacheData = await this.getFromCache(url)

          if (this.cache) {
            if (cacheData) { // data is in cache
              await this.server.log('Found', url, 'in cache.')
              if (typeof cacheData.code === 'number')
                res.statusCode = cacheData.code
  
              return res.send(
                this.clean(cacheData)
              )
            } else this.server.cache.data.delete(url)
          }
            
          const result = await this.onRequest(req, res)
        
          switch (typeof result) {
            case 'object':
              if (result === null || Array.isArray(result)) {
                const data = {
                  code: 400,
                  message: 'no message was provided',
                  result
                }
      
                res.statusCode = 400
                await this.addToCache(url, data) // cache

                return res.send(
                  this.clean(data)
                )
              }

              if (result.willPipe)
                break

              if (typeof result.code === 'number')
                res.statusCode = result.code

              if (!result.error) // don't cache when errored
                await this.addToCache(url, result)

              res.send(
                this.clean(result)
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
            this.clean(data)
          )
        }
      }
    )
  }

  public async onRequest(_req: HttpReq, _res: HttpRes): Promise<PathReturnable | void> {}
}

export default Path