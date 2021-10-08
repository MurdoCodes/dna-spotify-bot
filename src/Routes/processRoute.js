const express = require(`express`)
router = express.Router()

processController = require(`../Controllers/processController`)
processController2 = require(`../Controllers/processController2`)
const helper = require(`../Helpers/helper`)
const authenticateToken = helper.authenticateToken

router.get(`/`, processController.login)
module.exports = router