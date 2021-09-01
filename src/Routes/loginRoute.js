const express = require(`express`)
router = express.Router()

loginController = require(`../Controllers/loginController`)

mlaloginController = require(`../Controllers/mlaloginController`)

router.get(`/`, loginController.login)

router.get(`/mla`, mlaloginController.login)

module.exports = router