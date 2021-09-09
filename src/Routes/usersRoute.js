const express = require(`express`)
router = express.Router()

usersController = require(`../Controllers/usersController`)

router.post(`/register`, usersController.createUser) // Create User/Register
router.post(`/login`, usersController.loginUser) // Login

router.put(`/update`, usersController.updateUser) // Update Single User

router.get(`/profile`, usersController.fetchAllUsers) // Fetch All Users
router.get(`/profile/:id`, usersController.fetchSingleUser) // Fetch Single User

router.delete(`/delete`, usersController.deleteAllUser) // Delete All Users
router.delete(`/delete/:id`, usersController.deleteSingleUser) // Delete Single User

module.exports = router