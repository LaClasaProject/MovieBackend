import config from './config.json'
import HttpServer from './src/base/HttpServer'

import bodyParser from 'body-parser'
import cors from 'cors'


// import paths
import DiscordOauthToken from './src/routes/oauth/token/Discord'
import GithubOauthToken from './src/routes/oauth/token/Github'

import GetUserById from './src/routes/admin/GetUserById'
import GetUsers from './src/routes/admin/GetUsers'

import GetMe from './src/routes/oauth/GetMe'
import GetWebUser from './src/routes/api/GetWebUser'

import SetWebUsername from './src/routes/api/SetWebUsername'
import SearchPlayer from './src/routes/api/SearchPlayer'

import LinkAccount from './src/routes/api/LinkAccount'

const main = async () => {
  const http = new HttpServer(config as any)

  // set restana middlewares
  http.restana.use(
    bodyParser.json()
  )

  http.restana.use(
    cors()
  )
  
  // register paths
  await http.register(GetUsers)
  await http.register(GetUserById)


  await http.register(DiscordOauthToken)
  await http.register(GithubOauthToken)

  await http.register(GetMe)

  // api routes for the web
  await http.register(GetWebUser)
  await http.register(SetWebUsername)
  await http.register(SearchPlayer)
  await http.register(LinkAccount)

  try {
    await http.ready()
    console.log('Backend ready')
  } catch(err) {
    console.error(err)
  }
}

main()