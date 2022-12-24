const express = require('express')
const checkout = require('../middleware/auth')
const checkRoleAuth = require('../middleware/roleAuth')

const router = express.Router()



let menu = [
    {
        title: 'Inicio',
        elements: [
            {
                icon: 'fas fa-tachometer-alt',
                title: 'Dashboard',
                ref: '/panel'
            }, {
                icon: 'fas fa-teeth',
                title: 'Productos',
                ref: '/products'
            },  {
                icon: 'fas fa-tooth',
                title: 'Dentistas',
                ref: '/dentistas'
            },
            {
                icon: 'far fa-plus-square',
                title: 'Generar orden',
                ref: '/orders',
            },

            {
                icon: 'fas fa-laptop-medical',
                title: 'Historial',
                ref: '/history'
            },
        
        ]
    },
    {
        title: 'Ordenes',
        elements: [

            {
                icon: 'fas fa-arrow-right',
                title: 'Entrantes',
                ref: '/orders',
            },
            {
                icon: 'fas fa-business-time',
                title: 'A Prueba',
                ref: '/orders',
            },
            {
                icon: 'fas fa-undo-alt',
                title: 'Regresadas',
                ref: '/orders',
            },
            {
                icon: 'fas fa-check-circle',
                title: 'Terminadas',
                ref: '/orders',
            },
            {
                icon: 'fas fa-exchange-alt',
                title: 'Con Cambios',
                ref: '/orders',
            },
            {
                icon: 'fas fa-ban',
                title: 'Canceladas',
                ref: '/orders',
            },


           
        ]
    }]



// rutas para visualizar
router.get("/", async (req, res) => {

    res.render('index', {
            title: 'ToothLabMX'
        }
    )
})

router.get("/panel", async (req, res) => {

    res.render('panel', {
            title: 'ToothLabMX | Panel',
            menu: menu
        }
    )
})

router.get("/orders", async (req, res) => {

    res.render('ordenes', {
        title: 'ToothLabMX | Ordenes',
        menu: menu
    })
})

router.get("/products", async (req, res) => {

    res.render('productos', {
        title: 'ToothLabMX | Productos',
        menu: menu
    })
})

router.get("/dentistas", async (req, res) => {

    res.render('dentistas', {
        title: 'ToothLabMX | Dentistas',
        menu: menu
    })
})

router.get("/history", async (req, res) => {

    res.render('historial', {
        title: 'ToothLabMX | Historial',
        menu: menu
    })
})


module.exports = router
