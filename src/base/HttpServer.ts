import restana from 'restana'
import knex, { Knex } from 'knex'

import {
  IConfig,
  IVideoData
} from '../Types'

import Path from './Path'

class HttpServer {
  public restana = restana()
  public routes: Map<string, Path> = new Map()

  public db: Knex<any, unknown[]>
  public fileNameCache: Map<string, string | string[]> = new Map()

  public videoMeta: Map<string, IVideoData> = new Map()
  public PROCESS_CWD = process.cwd()

  constructor(public config: IConfig) {
    this.db = knex({
      client: 'mysql',
      connection: this.config.db
    })
  }

  public async ready() {
    // prepare tables
    if (
      !(await this.db.schema.hasTable('Videos'))
    )
      await this.db.schema.createTable(
        'Videos', (table) => {
          table.string('VideoId', 64)
            .notNullable()
            .primary()
          table.boolean('IsSeries')
          
          table.text('MetaTitle')
          table.text('MetaDesc')

          table.tinyint('Seasons')
          table.binary('Episodes')

          table.text('PosterUrl')
          table.text('CoverUrl')

          table.boolean('IsAvailable')
          table.string('VideoUrl')
        }
      )

    return this.restana.start(this.config.http.port)
  }

  public async register(path: typeof Path) {
    const pathInstance = new path()

    this.routes.set(pathInstance.path, pathInstance)
    await pathInstance.register(this)
  }
}

export default HttpServer