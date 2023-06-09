const express = require('express')
const router = express.Router()

let logo = "./public/img/logo2.png"

let menu = [
    {
        icon: 'far fa-plus-square',
        img: './public/img/iconsMenu/ordenes.png',
        title: 'Generar orden',
        ref: '/orders',
    },
    {
        icon: 'far fa-plus-square',
        img: './public/img/iconsMenu/contabilidad.png',
        title: 'Sección contable',
        ref: '/contable',
    },
    {
        icon: 'fas fa-teeth',
        img: './public/img/iconsMenu/products.png',
        title: 'Productos',
        ref: '/products'
    }, {
        icon: 'fas fa-tooth',
        img: './public/img/iconsMenu/dentista.png',
        title: 'Dentistas',
        ref: '/dentistas'
    },

    {
        icon: 'fas fa-arrow-right',
        img: './public/img/iconsMenu/tiempo.png',
        title: 'Historico',
        ref: '/status_historico',
    },
    {
        icon: 'fas fa-arrow-right',
        img: './public/img/iconsMenu/diente.png',
        title: 'Entrantes',
        ref: '/status_entrante',
    },
    {
        icon: 'fas fa-business-time',
        img: './public/img/iconsMenu/prueba.png',
        title: 'A Prueba',
        ref: '/status_prueba',
    },
    {
        icon: 'fas fa-undo-alt',
        img: './public/img/iconsMenu/regreso.png',
        title: 'Regresadas',
        ref: '/status_regresadas',
    },
    {
        icon: 'fas fa-check-circle',
        img: './public/img/iconsMenu/terminado.png',
        title: 'Terminadas',
        ref: '/status_terminadas',
    },
    {
        icon: 'fas fa-exchange-alt',
        img: './public/img/iconsMenu/cambios.png',
        title: 'Con Cambios',
        ref: '/status_cambios',
    },
    {
        icon: 'fas fa-ban',
        title: 'Canceladas con costos',
        img: './public/img/iconsMenu/cancelarConCostos.png',
        ref: '/status_CancelConCostos',
    },
    {
        icon: 'fas fa-ban',
        img: './public/img/iconsMenu/cancelado.png',
        title: 'Canceladas',
        ref: '/status_canceladas',
    },


]


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
            menu,
            logo

        }
    )
})

router.get("/orders", async (req, res) => {

    res.render('ordenes', {
        title: 'ToothLabMX | Ordenes',
        menu,
        logo
    })
})

router.get("/products", async (req, res) => {

    res.render('productos', {
        title: 'ToothLabMX | Productos',
        menu,
        logo
    })
})

router.get("/dentistas", async (req, res) => {

    res.render('dentistas', {
        title: 'ToothLabMX | Dentistas',
        menu,
        logo
    })
})

router.get("/contable", async (req, res) => {

    res.render('contable', {
        title: 'ToothLabMX | Sección contable',
        menu,
        logo
    })
})

//RUTAS DE LAS VISTAS PARA LA SECCION DE ORDENES



router.get("/status_historico", async (req, res) => {

    res.render('statusViews/status_historico', {
        title: 'ToothLabMX | Historico',
        menu,
        logo,
        status: 0
    })
})

router.get("/status_entrante", async (req, res) => {

    res.render('statusViews/status_entrante', {
        title: 'ToothLabMX | Entrantes',
        menu,
        logo,
        status: 1
    })
})

router.get("/status_prueba", async (req, res) => {

    res.render('statusViews/status_prueba', {
        title: 'ToothLabMX | A prueba',
        menu,
        logo,
        status: 2
    })
})

router.get("/status_regresadas", async (req, res) => {

    res.render('statusViews/status_regresadas', {
        title: 'ToothLabMX | Regresadas',
        menu,
        logo,
        status: 3
    })
})

router.get("/status_terminadas", async (req, res) => {

    res.render('statusViews/status_terminadas', {
        title: 'ToothLabMX | Terminadas',
        menu,
        logo,
        status: 4
    })
})

router.get("/status_cambios", async (req, res) => {

    res.render('statusViews/status_cambios', {
        title: 'ToothLabMX | Con cambios',
        menu,
        logo,
        status: 5
    })
})

router.get("/status_CancelConCostos", async (req, res) => {

    res.render('statusViews/status_CancelConCostos', {
        title: 'ToothLabMX | Canceladas con cambios',
        menu,
        logo,
        status: 6
    })
})

router.get("/status_canceladas", async (req, res) => {

    res.render('statusViews/status_canceladas', {
        title: 'ToothLabMX | Canceladas ',
        menu,
        logo,
        status: 7
    })
})

module.exports = router
