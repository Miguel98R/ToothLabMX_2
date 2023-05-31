const express = require('express')
const router = express.Router()


router.use('/auth/',require('./auth.routes.js'))
router.use('/dentist/', require('./dentistas.routes'))
router.use('/products/', require('./products.routes'))
router.use('/orders/', require('./orders.routes'))

router.all("*", (req, res) => {
    res.status(404).json({
        code: 404,
        message: 'Not Found',
        error: '404- Not Found',
        data: []

    })
})

module.exports = router
