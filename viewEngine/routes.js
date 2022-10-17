const express = require('express')
const router = express.Router()


//Ejemplo rutas
router.get("/", async (req, res) => {
    
    res.render('index', {
        title: 'ToothLabMX'}
        )
})



// router.get("/about", async (req, res) => {

//     res.render('about',{title: 'I need a service | about'})
// })



module.exports = router
