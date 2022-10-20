const json = require('body-parser/lib/types/json')
const express = require('express')
const router = express.Router()

let {new_user} = require('../controllers/user.controller')


router.post('/newUser/',new_user )

module.exports = router