const json = require('body-parser/lib/types/json')
const express = require('express')
const router = express.Router()

let {registrer_user , login_user} = require('../controllers/auth.controller')


router.post('/registrer/',registrer_user )

router.post('/login/',login_user )

module.exports = router