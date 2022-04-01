import config from './config.json'
import HttpServer from './src/base/HttpServer'

// import paths
import GetUsers from './src/routes/GetUsers'
import GetUserById from './src/routes/GetUserById'

const main = async () => {
  const http = new HttpServer(config)
  
  // register paths
  await http.register(GetUsers)
  await http.register(GetUserById)

  try {
    await http.ready()
    console.log('Backend ready')
  } catch(err) {
    console.error(err)
  }
}

main()