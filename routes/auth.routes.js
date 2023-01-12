const json = require('body-parser/lib/types/json')
const express = require('express')
const router = express.Router()
const checkout = require('./../middleware/auth')
const checkRoleAuth = require('./../middleware/roleAuth')

let {registrer_user, login_user, verify} = require('../controllers/auth.controller')


//VERIFICACION DEL TOKEN
router.all('/verify', [checkout, checkRoleAuth("admin")], verify)

//REGISTRO DE USUARIOS
router.post('/registrer', registrer_user)

//LOGIN USUARIOS
router.post('/login', login_user)


module.exports = router
