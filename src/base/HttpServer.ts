import restana from 'restana'
import { IConfig } from '../types/Config'

import Path from './Path'
import Utils from '../Utils'

import Models from '../Schemas'
import { connect } from 'mongoose'

import moment from 'moment'

class HttpServer {
  public restana = restana()
  public routes: Map<string, Path> = new Map()

  public PROCESS_CWD = process.cwd()
  public utils = new Utils(this)

  public models = Models
  public cache = {
    ttl: 5, // in minutes
    data: new Map<
      string,
      {
        expiry: number,
        data: Buffer
      } | undefined
    >() // cache url reponses instead
  }

  constructor(public config: IConfig) {}

  public async log(...content: string[]) {
    return new Promise(
      (resolve) => resolve(
        console.log(
          moment()
            .format('LLL'),
          '|',
          ...content
        )
      )
    )
  }

  public async ready() {
    await connect(
      `mongodb://${this.config.db.host}:${this.config.db.port}`,
      {
        user: this.config.db.user,
        pass: this.config.db.pass,

        dbName: this.config.db.dbName,
        authSource: this.config.db.authSource
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
