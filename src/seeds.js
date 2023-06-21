const mongoose = require('mongoose')
const {databaseConnector} = require('./database')

const {Role} = require('./models/RoleModel')
const {User} = require('./models/UserModel')
const {Post} = require('./models/PostModel')

const dotenv = require('dotenv')
dotenv.config()

const roles = [
    {
        name: "regular",
        description:"A regular user can view, create and read data. They can edit and delete only their own data."
    },
    {
        name: "admin",
        description:"An admin user has full access and permissions to do anything and everything within this API."
    },
    {
        name:"banned",
        description:"A banned user can read data, but cannot do anything else."
    }
]

const users = []
const posts = []

let databaseURL = ""
switch (process.env.NODE_ENV.toLowerCase()) {
    case "test":
        databaseURL = "mongodb://localhost:27017/ExpressBuildAnAPI-test";
        break;
    case "development":
        databaseURL = "mongodb://localhost:27017/ExpressBuildAnAPI-dev";
        break;
    case "production":
        databaseURL = process.env.DATABASE_URL;
        break;
    default:
        console.error("Incorrect JS environment specified, database will not be connected.");
        break;
}

databaseConnector(databaseURL).then(()=>{
    console.log("Database connected successfully")
}).catch(error => {
    console.log(`Some error occured connecting to the database. Error: ${error}`)
}).then(async () => {
    if (process.env.WIPE == 'true'){
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.map((collection) => collection.name)
        .forEach(async (collectionName) => {
            mongoose.connection.db.dropCollection(collectionName);
        });
        console.log("Old DB data deleted.");
    }
}).then(async () => {
    await Role.insertMany(roles)
    console.log("New DB data inserted")
} ).then(() => {
    mongoose.connection.close()
    console.log("Db seed connection closed")
})