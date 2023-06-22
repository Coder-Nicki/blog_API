const express = require('express')
const router = express.Router()
const {User} = require('../models/UserModel')

const {
    encryptString, decryptString, decryptObject, hashString, validateHashedData, 
    generateJWT, generateUserJWT, verifyUserJWT, 
    getAllUsers, getSpecificUser, createUser, updateUser, deleteUser
} = require('../controllers/users_controller');

router.post('/signup', async (request, response) => {
    let userDetails = {
        email: request.body.email,
        password: request.body.password,
        username: request.body.username,
        country: request.body.country,
        roleID: request.body.roleID
    }
    let newUserDoc = await createUser(userDetails)
    response.json({
        user: newUserDoc
    })
})

router.post('/sign-in', async (request, response) => {
    let targetUser = await User.findOne({email: request.body.email})
    if (await validateHashedData(request.body.password, targetUser.password)){
        let encryptedUserJwt = await generateUserJWT(
            {
                userID: targetUser.id,
                email: targetUser.email,
                password: targetUser.password
            }
        );
        response.json(encryptedUserJwt);

    } else {
        response.status(400).json({message:"Invalid user details provided."});
    }
})

router.post('/token-refresh', async(request, response) => {
    let oldToken = request.body.jwt;
    let refreshResult = await verifyUserJWT(oldToken).catch(error => {return {error: error.message}})
    response.json(refreshResult);
});

router.put('/:userId', async (request, response) => {
    let userDetails = {
        userId: request.params.userId,
        updatedData: request.body.newUserData
    }
    response.json(await updateUser(userDetails))
})

router.delete('/:userId', async (request, response) => {
    response.json(await deleteUser(request.params.UserId))
})

router.get('/', async (request, response) => {
    let allUsers = await getAllUsers()
    response.json({
        userCount: allUsers.length,
        usersArray: allUsers
    })
})

module.exports = {
    router
}

