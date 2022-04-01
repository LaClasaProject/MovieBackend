import restana from 'restana'
import Path from './Path'

class HttpServer {
  public restana = restana()
  public routes: Map<string, Path> = new Map()

  constructor() {}

  public ready() {
    return this.restana.start(3000)
  }

  public async register(path: typeof Path) {
    const pathInstance = new path()

    this.routes.set(pathInstance.path, pathInstance)
    await pathInstance.register(this)
  }
}

export default HttpServer