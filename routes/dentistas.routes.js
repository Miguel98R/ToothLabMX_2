const json = require('body-parser/lib/types/json')
const express = require('express')
const router = express.Router()

let {new_dentist} = require('../controllers/dentistas.controller')


router.post('/new_dentist',new_dentist )

module.exports = router