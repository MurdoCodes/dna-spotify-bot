
const express = require(`express`)
router = express.Router()
const taskController = require(`../Controllers/taskController`)

router.post(`/create`, taskController.createTask) // Create New User
router.post(`/update`, taskController.updateTask)

router.get(`/`, taskController.fetchAllTask) // Fetch All Users
router.get(`/:id`, taskController.fetchSingleTask) // Fetch Single User

router.delete(`/delete`, taskController.deleteAllTask) // Delete All Users
router.delete(`/delete/:id`, taskController.deleteSingleTask) // Delete Single User

module.exports = router