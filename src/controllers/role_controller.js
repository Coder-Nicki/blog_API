const {Role} = require('../models/RoleModel')
const {User} = require('../models/UserModel')

async function getAllRoles(){
    return await Role.find({})
}

async function getUsersWithRole(roleName){
    let roleId = await Role.find({name: roleName})
    return roleId
    // let usersFound = await User.find({role: roleId})
    // return usersFound
}

module.exports = {
    getAllRoles,
    getUsersWithRole
}