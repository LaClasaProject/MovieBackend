import config from './config.json'
import HttpServer from './src/base/HttpServer'

import bodyParser from 'body-parser'
import cors from 'cors'

// import paths
import GetVideoById from './src/routes/video/GetVideoById'
import GetVideos from './src/routes/video/GetVideos'

import GetVideo from './src/routes/video/GetVideoData'

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
  await http.register(GetVideoById)
  await http.register(GetVideos)

  await http.register(GetVideo)

  try {
    await http.ready()
    console.log('Backend ready')
  } catch(err) {
    console.error(err)
  }
}

main()