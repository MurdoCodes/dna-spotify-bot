const express = require(`express`)
router = express.Router()

processController = require(`../Controllers/processController`)
const helper = require(`../Helpers/helper`)
const authenticateToken = helper.authenticateToken

router.get(`/`, authenticateToken, processController.login)
module.exports = router