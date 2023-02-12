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
                img : './public/img/iconsMenu/ordenes.png',
                title: 'Dashboard',
                ref: '/panel'
            }, {
                icon: 'fas fa-teeth',
                img : './public/img/iconsMenu/products.png',
                title: 'Productos',
                ref: '/products'
            }, {
                icon: 'fas fa-tooth',
                img : './public/img/iconsMenu/dentista.png',
                title: 'Dentistas',
                ref: '/dentistas'
            },
            {
                icon: 'far fa-plus-square',
                img : './public/img/iconsMenu/ordenes.png',
                title: 'Generar orden',
                ref: '/orders',
            },



        ]
    },
    {
        title: 'Ordenes',
        elements: [

            {
                icon: 'fas fa-arrow-right',
                img : './public/img/iconsMenu/entrante.png',
                title: 'Entrantes',
                ref: '/status_entrante',
            },
            {
                icon: 'fas fa-business-time',
                img : './public/img/iconsMenu/prueba.png',
                title: 'A Prueba',
                ref: '/status_prueba',
            },
            {
                icon: 'fas fa-undo-alt',
                img : './public/img/iconsMenu/regreso.png',
                title: 'Regresadas',
                ref: '/status_regresadas',
            },
            {
                icon: 'fas fa-check-circle',
                img : './public/img/iconsMenu/terminado.png',
                title: 'Terminadas',
                ref: '/status_terminadas',
            },
            {
                icon: 'fas fa-exchange-alt',
                img : './public/img/iconsMenu/cambios.png',
                title: 'Con Cambios',
                ref: '/status_cambios',
            },
            {
                icon: 'fas fa-ban',
                title: 'Canceladas con costos',
                img : './public/img/iconsMenu/cancelarConCostos.png',
                ref: '/status_CancelConCostos',
            },
            {
                icon: 'fas fa-ban',
                img : './public/img/iconsMenu/cancelado.png',
                title: 'Canceladas',
                ref: '/status_canceladas',
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

    console.log("----------------------------",menu)
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


//RUTAS DE LAS VISTAS PARA LA SECCION DE ORDENES

router.get("/status_entrante", async (req, res) => {

    res.render('statusViews/status_entrante', {
        title: 'ToothLabMX | Entrantes',
        menu: menu,
        status : 1
    })
})

router.get("/status_prueba", async (req, res) => {

    res.render('statusViews/status_prueba', {
        title: 'ToothLabMX | A prueba',
        menu: menu,
        status : 2
    })
})

router.get("/status_regresadas", async (req, res) => {

    res.render('statusViews/status_regresadas', {
        title: 'ToothLabMX | Regresadas',
        menu: menu,
        status : 3
    })
})

router.get("/status_terminadas", async (req, res) => {

    res.render('statusViews/status_terminadas', {
        title: 'ToothLabMX | Terminadas',
        menu: menu,
        status : 4
    })
})

router.get("/status_cambios", async (req, res) => {

    res.render('statusViews/status_cambios', {
        title: 'ToothLabMX | Con cambios',
        menu: menu,
        status : 5
    })
})

router.get("/status_CancelConCostos", async (req, res) => {

    res.render('statusViews/status_CancelConCostos', {
        title: 'ToothLabMX | Canceladas con cambios',
        menu: menu,
        status : 6
    })
})

router.get("/status_canceladas", async (req, res) => {

    res.render('statusViews/status_canceladas', {
        title: 'ToothLabMX | Canceladas ',
        menu: menu,
        status : 7
    })
})

module.exports = router
