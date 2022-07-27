import config from './config.json'
import HttpServer from './src/base/HttpServer'

import bodyParser from 'body-parser'
import cors from 'cors'

// v2 paths
import GetVideoById from './src/routes/video/GetVideoById'
import AddVideo from './src/routes/video/AddVideo'

import GetVideos from './src/routes/video/GetVideos'
import UpdateVideo from './src/routes/video/UpdateVideo'

import DeleteVideo from './src/routes/video/DeleteVideo'
import GetTop5Videos from './src/routes/video/GetTop5Videos'

import GetPinnedVideos from './src/routes/video/GetPinnedVideos'

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
  await http.register(UpdateVideo)

  await http.register(DeleteVideo)
  await http.register(GetTop5Videos)

  await http.register(GetPinnedVideos)

  try {
    await http.ready()
    console.log('Backend ready')
  } catch(err) {
    console.error(err)
  }
}

main()