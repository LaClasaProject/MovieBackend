import restana from 'restana'
import knex, { Knex } from 'knex'

import { IConfig } from '../Types'
import Path from './Path'

class HttpServer {
  public restana = restana()
  public routes: Map<string, Path> = new Map()

  public db: Knex<any, unknown[]>

  constructor(public config: IConfig) {
    this.db = knex({
      client: 'mysql',
      connection: this.config.db
    })
  }

  public ready() {
    return this.restana.start(this.config.http.port)
  }

  public async register(path: typeof Path) {
    const pathInstance = new path()

    this.routes.set(pathInstance.path, pathInstance)
    await pathInstance.register(this)
  }
}

export default HttpServer