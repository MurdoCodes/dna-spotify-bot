const express = require(`express`)
router = express.Router()

loginController = require(`../Controllers/processController`)

router.get(`/`, loginController.login)
module.exports = router