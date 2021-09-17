
const express = require(`express`)
router = express.Router()

const taskController = require(`../Controllers/taskController`)
const helper = require(`../Helpers/helper`)
const authenticateToken = helper.authenticateToken

router.post(`/create`, authenticateToken, taskController.createTask) // Create New User
router.post(`/update`, authenticateToken, taskController.updateTask)

router.get(`/`, authenticateToken, taskController.fetchAllTask) // Fetch All Users
router.get(`/:id`, authenticateToken, taskController.fetchSingleTask) // Fetch Single User

router.delete(`/delete`, authenticateToken, taskController.deleteAllTask) // Delete All Users
router.delete(`/delete/:id`, authenticateToken, taskController.deleteSingleTask) // Delete Single User

module.exports = router