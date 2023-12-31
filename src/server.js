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

const rolesRouter = require('./routes/role_routes')
app.use('/roles', rolesRouter)

const usersRouter = require('./routes/user_routes')
app.use('/users', usersRouter)

const postsRouter = require('./routes/post_router')
app.use('/posts', postsRouter)

app.get('/databaseDump', async (request, response) => {
    const dumpContainer = {}
    let collections = await mongoose.connection.db.listCollections().toArray()
    collections = collections.map((collection) => collection.name)

    for (const collectionName of collections){
        let collectionData = await mongoose.connection.db.collection(collectionName).find({}).toArray()
        dumpContainer[collectionName] = collectionData
    }
    console.log("Dumping all of this data to the client: \n" + JSON.stringify(dumpContainer, null, 4))
    response.json({
        data: dumpContainer
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