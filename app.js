
const express = require('express')
const AppConfig = require('./config')


const app = express()
const port = 3000

let appConfig =  new AppConfig(app)




app.listen(appConfig.listenPort, () => console.log(`Example app listening on port ${appConfig.listenPort}!`))