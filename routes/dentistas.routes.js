const json = require('body-parser/lib/types/json')
const express = require('express')
const router = express.Router()

let {new_dentist , data_table} = require('../controllers/dentistas.controller')


router.post('/new_dentist',new_dentist )

router.get('/data_dataTables/',data_table )

module.exports = router