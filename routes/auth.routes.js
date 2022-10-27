const json = require('body-parser/lib/types/json')
const express = require('express')
const router = express.Router()
const checkout = require('./../middleware/auth')
const checkRoleAuth = require('./../middleware/roleAuth')

let {registrer_user, login_user, verify} = require('../controllers/auth.controller')



router.all('/verify', [checkout, checkRoleAuth("admin")], verify)

router.post('/registrer', registrer_user)

router.post('/login', login_user)


module.exports = router
