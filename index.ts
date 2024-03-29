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
import ReplaceVideo from './src/routes/video/ReplaceVideo'

import SearchVideo from './src/routes/video/SearchVideo'

// user-related routes
import CreateUser from './src/routes/user/CreateUser'
import LoginUser from './src/routes/user/LoginUser'

import GetLibrary from './src/routes/user/GetLibrary'
import CreateOrder from './src/routes/orders/CreateOrder'

import CaptureOrder from './src/routes/orders/CaptureOrder'
import GetPlans from './src/routes/plans/GetPlans'

import GetUser from './src/routes/user/GetUser'

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
  await http.register(ReplaceVideo)

  await http.register(SearchVideo)

  await http.register(CreateUser)
  await http.register(LoginUser)

  await http.register(GetLibrary)
  await http.register(CreateOrder)

  await http.register(CaptureOrder)
  await http.register(GetPlans)

  await http.register(GetUser)

  try {
    await http.ready()
    await http.log('Backend ready')
  } catch(err) {
    console.error(err)
  }
}

main()