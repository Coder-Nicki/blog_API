const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000

const helmet = require('helmet')
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy({
    directives:{
        defaultSrc:["'self'"]
    }
}));

const cors = require('cors')
var corsOptions = {
    origin: ["http://localhost:5000", "https://deployedApp.com"],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const mongoose = require('mongoose')
let databaseURL = ""
switch (process.env.NODE_ENV.toLowerCase()){
    case "test":
        databaseURL = 'mongodb://localhost:27017/ExpressBuildAnAPI-test'
        break
    case "development":
        databaseURL = "mongodb://localhost:27017/ExpressBuildAnAPI-dev"
        break
    case "production":
        databaseURL = process.env.DATABASE_URL
        break
    default:
        console.error("Incorrect JS environment specified, database will not be connected.")
        break
}

const {databaseConnector} = require('./database')
databaseConnector(databaseURL).then(()=> {
    console.log("Database connected successfully!")
}).catch(error => {
    console.log(`Some error occurred connecting to the database! It was: ${error}`)
})

app.get("/databaseHealth", (request, response) => {
    let databaseState = mongoose.connection.readyState;
    let databaseName = mongoose.connection.name;
    let databaseModels = mongoose.connection.modelNames();
    let databaseHost = mongoose.connection.host;

    response.json({
        readyState: databaseState,
        dbName: databaseName,
        dbModels: databaseModels,
        dbHost: databaseHost
    })
})
app.get('/', (request, response) => {
    response.json({
        message: "Welcome to the blog page"
    })
})

app.get('*', (request, response) => {
    response.status(404).json({
        message: "No route found for that path",
        attemptedPath: request.path
    })
})

module.exports = {
    app, HOST, PORT
}