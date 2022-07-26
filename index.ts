import config from './config.json'
import HttpServer from './src/base/HttpServer'

import bodyParser from 'body-parser'
import cors from 'cors'

// v2 paths
import GetVideoByIdV2 from './src/routes/video/GetVideoById'
import AddVideoV2 from './src/routes/video/AddVideo'

import GetVideosV2 from './src/routes/video/GetVideos'

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
  await http.register(GetVideoByIdV2)
  await http.register(AddVideoV2)

  await http.register(GetVideosV2)

  try {
    await http.ready()
    console.log('Backend ready')
  } catch(err) {
    console.error(err)
  }
}

main()