const express = require(`express`)
router = express.Router()

usersController = require(`../Controllers/usersController`)

router.get(`/profile`, usersController.fetchAllUsers) // Fetch All Users
router.get(`/profile/:id`, usersController.fetchSingleUser) // Fetch Single Users

router.delete(`/delete`, usersController.deleteAllUser) // Delete All Users
router.delete(`/delete/:id`, usersController.deleteSingleUser) // Delete Single Users

router.post(`/register`, usersController.createUser) // Create Single Users
router.post(`/login`, usersController.loginUser)
router.put(`/update`, usersController.updateUser) // Update Single Users

module.exports = router