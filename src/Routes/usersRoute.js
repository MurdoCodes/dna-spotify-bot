const express = require(`express`)
router = express.Router()

usersController = require(`../Controllers/usersController`)

router.get(`/viewAll`, usersController.fetchAllUsers) // Fetch All Users
router.get(`/viewSingle/:id`, usersController.fetchSingleUser) // Fetch Single Users
router.post(`/createUser`, usersController.createUser) // Create Single Users
router.put(`/updateUser`, usersController.updateUser) // Update Single Users
router.get(`/deleteAllUsers`, usersController.deleteAllUser) // Delete All Users
router.get(`/deleteUser/:id`, usersController.deleteUser) // Delete Single Users

module.exports = router