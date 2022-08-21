import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

class SearchVideo extends Path implements IRoute {
  public path   = '/api/videos/find/:title'
  public method = 'get'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { title } = req.params as unknown as { title: string }

    if (!title || title.length < 3)
      return {
        error: true,
        message: 'Please provide a proper title.',
        code: 400
      }

    return {
      value: await this.server.utils.searchByTitle(
        decodeURIComponent(title)
      ),
      code: 200
    }
  }
}

export default SearchVideo