const express = require('express')
const router = express.Router()


//Ejemplo rutas
router.get("/login", async (req, res) => {
    
    res.render('index', {
        title: 'ToothLabMX'}
        )
})

router.get("/panel", async (req, res) => {
    
    res.render('panel', {
        title: 'ToothLabMX|Panel'}
        )
})




// router.get("/about", async (req, res) => {

//     res.render('about',{title: 'I need a service | about'})
// })



module.exports = router
