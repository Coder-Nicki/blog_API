const express = require('express')
const router = express.Router()
const {getAllRoles, getUsersWithRole} = require('../controllers/role_controller')

router.get('/', async (request, response) => {
    let responseData = await getAllRoles()
    response.json({
        data: responseData
    })
})

router.get('/:roleName', async (request, response) => {
    let responseData = await getUsersWithRole(request.params.roleName)
    response.json({
        data: responseData
    })
})

module.exports = router;