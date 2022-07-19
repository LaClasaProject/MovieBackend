import Path from '../../base/Path'
import {
  IRoute
} from '../../Types'

// TODO: Add more routes and finish
class NewUser extends Path implements IRoute {
  public path   = '/user/new'
  public method = 'get'

  public async onRequest() {
    
  }
}

export default NewUser