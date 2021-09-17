const express = require(`express`)

const usersController = require(`../Controllers/usersController`)
const helper = require(`../Helpers/helper`)
const authenticateToken = helper.authenticateToken

router = express.Router()

router.post(`/register`, usersController.createUser) // Create User/Register
router.post(`/login`, usersController.loginUser) // Login User

router.get(`/login`, authenticateToken, (req, res) => { // Check if user is logged in or not
    res.send({
        LoggedIn: true,
        user: req.user
    })
})

router.put(`/update`, authenticateToken, usersController.updateUser) // Update Single User

router.get(`/profile`, authenticateToken, usersController.fetchAllUsers) // Fetch All Users
router.get(`/profile/:id`, authenticateToken, usersController.fetchSingleUser) // Fetch Single User

router.delete(`/delete`, authenticateToken, usersController.deleteAllUser) // Delete All Users
router.delete(`/delete/:id`, authenticateToken, usersController.deleteSingleUser) // Delete Single User

module.exports = router