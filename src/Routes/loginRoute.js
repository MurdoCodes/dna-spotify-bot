const express = require(`express`)
router = express.Router()

loginController = require(`../Controllers/loginController`)

router.get(`/`, loginController.login)

module.exports = router