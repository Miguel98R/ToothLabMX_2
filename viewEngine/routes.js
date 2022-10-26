const express = require('express')
const checkout = require('../middleware/auth')
const checkRoleAuth = require('../middleware/roleAuth')

const router = express.Router()

let menu = [
    {
        title: 'Menu',
        elements: [
            {
                icon: 'fas fa-tachometer-alt',
                title: 'Dashboard',
                ref: '/panel'
            }, {
               
                icon: 'far fa-plus-square',
                title: 'Ordenes',
                ref: '/orders'
            }, {
              
                icon: 'fas fa-teeth',
                title: 'Productos',
                ref: '/products'
            }, {
                icon: 'fas fa-tooth',
                title: 'Dentistas',
                ref: '/dentistas'
            },
            {
                icon: 'fas fa-laptop-medical',
                title: 'Historial',
                ref: '/history'
            },
        ]
    },
   
    
]


// rutas para visualizar
router.get("/", async (req, res) => {
    
    res.render('index', {
        title: 'ToothLabMX'}
        )
})

router.get("/panel",checkout,checkRoleAuth(['admin']), async (req, res) => {
    
    res.render('panel', {
        title: 'ToothLabMX| Panel',
        menu:menu}
        )
})

router.get("/orders",checkout,checkRoleAuth(['admin']), async (req, res) => {
    
    res.render('ordenes', {
        title: 'ToothLabMX| Ordenes',
        menu:menu
    })
})

router.get("/products", checkout,checkRoleAuth(['admin']), async (req, res) => {

    res.render('productos', {
        title: 'ToothLabMX| Productos',
        menu:menu
    })
})

router.get("/dentistas",checkout,checkRoleAuth(['admin']), async (req, res) => {
    
    res.render('dentistas', {
        title: 'ToothLabMX| Dentistas',
        menu:menu
    })
})

router.get("/history",checkout,checkRoleAuth(['admin']), async (req, res) => {

    res.render('historial', {
        title: 'ToothLabMX| Historial',
        menu:menu
    })
})







module.exports = router
