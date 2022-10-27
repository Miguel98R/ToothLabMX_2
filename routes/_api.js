const express = require('express')
const router = express.Router()

//ejemplo ruta:


router.use('/auth/',require('./auth.routes.js'))
router.use('/users/', require('./user.routes'))
router.use('/dentist/', require('./dentistas.routes'))





router.all("*", (req, res) => {
    res.status(404).json({
        code: 404,
        message: 'Not Found',
        error: '404- Not Found',
        data: []

    })
})

module.exports = router
