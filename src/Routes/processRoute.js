const express = require(`express`)
router = express.Router()

const init = require(`../../scheduler`)

processController = require(`../Controllers/processController`)
processController2 = require(`../Controllers/processController2`)
const helper = require(`../Helpers/helper`)
const authenticateToken = helper.authenticateToken

router.get(`/`, processController.login)

router.get(`/init`, init.init) // Testing purpose
module.exports = router