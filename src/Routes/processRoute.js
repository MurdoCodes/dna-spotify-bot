const express = require(`express`)
router = express.Router()

processController = require(`../Controllers/processController`)
const helper = require(`../Helpers/helper`)
const authenticateToken = helper.authenticateToken

router.get(`/`, processController.login)
module.exports = router