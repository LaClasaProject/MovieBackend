import config from './config.json'
import HttpServer from './src/base/HttpServer'

// import paths
import DiscordOauthToken from './src/routes/oauth/Discord'
import GetUserById from './src/routes/admin/GetUserById'
import GetUsers from './src/routes/admin/GetUsers'

import GetMe from './src/routes/discord/GetMe'

const main = async () => {
  const http = new HttpServer(config as any)
  
  // register paths
  await http.register(GetUsers)
  await http.register(GetUserById)
  await http.register(DiscordOauthToken)

  await http.register(GetMe)

  try {
    await http.ready()
    console.log('Backend ready')
  } catch(err) {
    console.error(err)
  }
}

main()