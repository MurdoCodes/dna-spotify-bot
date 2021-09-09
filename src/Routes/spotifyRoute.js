const express = require(`express`)
router = express.Router()
const spotifyUsersController = require(`../Controllers/spotifyUsersController`)

router.post(`/create`, spotifyUsersController.createUser) // Create New User

router.get(`/profile`, spotifyUsersController.fetchAllUsers) // Fetch All Users
router.get(`/profile/:id`, spotifyUsersController.fetchSingleUser) // Fetch Single User

router.delete(`/delete`, spotifyUsersController.deleteAllUser) // Delete All Users
router.delete(`/delete/:id`, spotifyUsersController.deleteSingleUser) // Delete Single User

module.exports = router