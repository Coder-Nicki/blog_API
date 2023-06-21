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