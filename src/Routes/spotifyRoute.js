const express = require(`express`)
router = express.Router()

const spotifyUsersController = require(`../Controllers/spotifyUsersController`)
const helper = require(`../Helpers/helper`)
const authenticateToken = helper.authenticateToken

router.post(`/create`, authenticateToken, spotifyUsersController.createUser) // Create New User

router.get(`/profile`, authenticateToken, spotifyUsersController.fetchAllUsers) // Fetch All Users
router.get(`/profile/:id`, authenticateToken, spotifyUsersController.fetchSingleUser) // Fetch Single User

router.delete(`/delete`, authenticateToken, spotifyUsersController.deleteAllUser) // Delete All Users
router.delete(`/delete/:id`, authenticateToken, spotifyUsersController.deleteSingleUser) // Delete Single User
router.delete(`/deleteSelected`, authenticateToken, spotifyUsersController.deleteSelected) // Delete All Users

module.exports = router