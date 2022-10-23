const express = require('express')
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
                icon: 'fas fa-cog',
                title: 'Ordenes',
                ref: '/new_order'
            }, {
                icon: 'fas fa-folder-plus',
                title: 'Productos',
                ref: '/products'
            }, {
                icon: 'fab fa-dhl',
                title: 'Dentistas',
                ref: '/pago_guias'
            },
            {
                icon: 'fas fa-book-open',
                title: 'Historial',
                ref: '/history'
            },
        ]
    },
   
    
]


//Ejemplo rutas
router.get("/", async (req, res) => {
    
    res.render('index', {
        title: 'ToothLabMX'}
        )
})

router.get("/panel", async (req, res) => {
    
    res.render('panel', {
        title: 'ToothLabMX|Panel',
        menu:menu}
        )
})

router.get("/new_order", async (req, res) => {
    
    res.render('panel', {
        title: 'ToothLabMX|Ordenes',
        menu:menu}
        )
})







module.exports = router
