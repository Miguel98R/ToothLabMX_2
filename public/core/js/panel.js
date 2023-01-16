verificador()

$(document).ready(function () {


    let top_5_dentistas = function () {

        $('.top_5_dentistas').html('')

        api_conection('GET', 'api/dentist/top_5_dentist/', {}, function (data) {


            let dentisas_top = data.data

            for (let item of dentisas_top) {

                $('.top_5_dentistas').append('<div class="col-12 my-2 border-bottom border-dark">'

                    + '<small class="fw-bold"style="color:' + item.distintivo_color + ';">' + item.name_dentista + '</small>'
                    + '<br><mark style="color:' + item.distintivo_color + ';">' + item.email_dentista + '</mark>'

                    + '<br><small>Total de ordenes: ' + item.cont_ordenes + '</small>'

                    + '</div>')

            }


        })

    }

    let top_5_prducts = function () {

        $('.top_5_productos').html('')

        api_conection('GET', 'api/products/top_5_products/', {}, function (data) {


            let dentisas_top = data.data

            for (let item of dentisas_top) {

                $('.top_5_productos').append('<div class="col-12 my-2 py-2 border-bottom border-dark">'

                    + '<small class="my-2 fw-bold">' + item.name_producto + '</small>'
                    + '<br>'

                    + '<mark class="my-3">Total usado: ' + item.cuenta_uso + '</mark>'
                    + '<br>'

                    + '</div>')

            }


        })

    }

    let drawLastOrder = function () {

        api_conection('GET', 'api/orders/last_order/', {}, function (data) {


            let order_data = data.data

            let status = asignament_status(order_data.status)

            $('.see_last_order').append('<div class="card text-start">'

                + '<div class="card_header bg-dark text-white text-center py-2">'
                + '<h5>Ultima orden creada</h5>'
                + '</div>'
                + '<div class="card_body p-2">'
                + '<div class="row">'
                + '<div class="col-6">'
                + '<p class="fw-bold">Folio: <mark class="fw-normal"> ' + order_data.id_order + '</mark></p>'
                + '<p class="fw-bold">Fecha Entrada: <mark class="fw-normal"> ' + moment(order_data.fecha_entrante, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</mark></p>'
                + '<p class="fw-bold">Fecha Salida: <mark class="fw-normal"> ' + moment(order_data.fecha_saliente, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</mark></p>'
                + '</div>'
                + '<div class="col-6">'
                + '<p class="fw-bold">Dentista: <mark class="fw-normal" style="color:' + order_data.dentista.distintivo_color + ';"> ' + order_data.dentista.name_dentista + '</mark></p>'
                + '<p class="fw-bold">Paciente: <mark class="fw-normal"> ' + order_data.name_paciente + '</mark></p>'
                + '<p class="fw-bold">Status: <mark class="fw-normal"> ' + status + '</mark></p>'

                + '</div>'
                + '</div>'

                + '</div>'
                + '<div class="card_footer text-center py-2">'
                + '<button id_order="' + order_data._id + '" class="btn btn-info see_details mx-2 "> Ver Orden</button>'
                + '<button status="' + order_data.status + '" id_order="' + order_data._id + '" class="mx-2 btn btn-secondary search_order "> Encontrar Orden</button>'
                + '</div>'
                + '</div>')


        })

    }

    //DIRECCIONAR : CREAR ORDEN
    $('.goNewOrder').click(function () {
        location.href = '/orders'

    })
    //DIRECCIONAR : DENTISTAS
    $('.goDentistas').click(function () {
        location.href = '/dentistas'

    })

    //DIRECCIONAR : PRODUCTOS
    $('.goProductos').click(function () {
        location.href = '/products'

    })

    //ENCONTAR ORDEN POR STATUS
    $(document.body).on('click', '.search_order', function () {
        let status = $(this).attr('status')
        status = Number(status)

        switch (status) {
            case 1:
                location.href = '/status_entrante'
                break
            case 2:
                location.href = '/status_prueba'
                break
            case 3:
                location.href = '/status_regresadas'
                break
            case 4:
                location.href = '/status_terminadas'
                break
            case 5:
                location.href = '/status_cambios'
                break
            case 6:
                location.href = '/status_CancelConCostos'
                break
            case 7:
                location.href = '/status_canceladas'
                break
        }


    })


    //DETALLES DE LA ORDEN
    $(document.body).on('click', '.see_details', function () {

        let id_orden = $(this).attr('id_order')
        $('#detailsOrder_modal').modal('show')

        $('.details_general_order').html('')
        $('.details_product_order').html('')
        $('.comentario').html('')


        draw_modal_details(id_orden)

    })

    top_5_dentistas()
    top_5_prducts()
    drawLastOrder()

})