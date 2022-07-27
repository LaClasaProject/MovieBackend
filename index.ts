import config from './config.json'
import HttpServer from './src/base/HttpServer'

import bodyParser from 'body-parser'
import cors from 'cors'

// v2 paths
import GetVideoById from './src/routes/video/GetVideoById'
import AddVideo from './src/routes/video/AddVideo'

import GetVideos from './src/routes/video/GetVideos'

const main = async () => {
  const http = new HttpServer(config)

  // set restana middlewares
  http.restana.use(
    bodyParser.json()
  )

  http.restana.use(
    cors()
  )

  // v2 paths
  await http.register(GetVideoById)
  await http.register(AddVideo)

  await http.register(GetVideos)

  try {
    await http.ready()
    console.log('Backend ready')
  } catch(err) {
    console.error(err)
  }
}

main()