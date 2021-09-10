const express = require(`express`)
router = express.Router()

processController = require(`../Controllers/processController`)

router.get(`/`, processController.login)
module.exports = router