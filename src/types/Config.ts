interface IDatabaseConfig {
  host: string
  port: number | string

  user: string
  pass: string

  authSource: string
  dbName: string
}

interface IHttpConfig {
  port: number
  cleanedJsonResponses: boolean
}

interface IConfig {
  http: IHttpConfig
  db: IDatabaseConfig

  adminKeys: string[]
}

export {
  IDatabaseConfig,
  IHttpConfig,
  IConfig
}