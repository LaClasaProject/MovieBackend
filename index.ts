import HttpServer from "./src/base/HttpServer"

// import paths
import GetUsers from './src/routes/GetUsers'

const main = async () => {
  const http = new HttpServer()
  
  // register paths
  await http.register(GetUsers)

  await http.ready()
}

main()