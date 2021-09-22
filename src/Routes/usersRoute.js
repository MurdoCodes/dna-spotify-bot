const express = require(`express`)

const usersController = require(`../Controllers/usersController`)
const {authenticateToken, authRole} = require(`../Helpers/helper`)

router = express.Router()

/**
 * Post Requests
 */
router.post(`/registerAdmin`, usersController.createUser) // Create User/Register Admin Role
router.post(`/register`, usersController.createUser) // Create User/Register Basic Role
router.post(`/login`, usersController.loginUser) // Login User


/**
 * Get Requests
 */
router.get(`/login`, authenticateToken, (req, res) => { // Check if user is logged in or not
    res.send({
        LoggedIn: true,
        user: req.user
    })
})
router.get(`/profile`, authenticateToken, usersController.fetchAllUsers) // Fetch All Users
router.get(`/profile/:id`, authenticateToken, usersController.fetchSingleUser) // Fetch Single User

/**
 * Put Requests
 */
router.put(`/update`, authenticateToken, usersController.updateUser) // Update Single User

/**
 * Delete Requests
 */
router.delete(`/delete`, authenticateToken, usersController.deleteAllUser) // Delete All Users
router.delete(`/deleteSelected`, authenticateToken, usersController.deleteSelected) // Delete Selected Users
router.delete(`/delete/:id`, authenticateToken, usersController.deleteSingleUser) // Delete Single User

module.exports = router