verificador();

$(document).ready(function () {
    let today = moment().format("DD-MM-YYYY");

    $(".date_entrada").datepicker({language: "es", format: "dd-mm-yyyy", startDate: 'd'}).val(today);

    $(".date_entrada").datepicker('setDate', today);

    $(".date_salida").datepicker({language: "es", format: "dd-mm-yyyy", startDate: 'd'});

    $(".date_salida").datepicker('setDate', today);


    $("#fechaSalienteLast").datepicker({language: "es", format: "dd-mm-yyyy", startDate: 'd'});

    $("#fechaSalienteLast").datepicker('setDate', today);


    $(".saved_order").click(function () {


        let tooths = $(".btn-check");
        let dentist = $(".dentistas_name").val();
        let name_paciente = $(".paciente_name").val();
        let fecha_entrada = $(".date_entrada").val();
        let fecha_salida = $(".date_salida").val();
        let cantidad = $("#ToothsOrder").text();

        let producto_name = $(".producto_name").val();
        let color_name = $(".color_name").val();
        let comentario = $(".comntario_order").val();


        let tooths_array = [];
        let new_order = {};
        let new_order_details = {};

        if (dentist == "" || dentist == undefined) {
            notyf.open({type: "warning", message: "Seleccione el dentista"});
            return;
        }


        if (producto_name == "" || producto_name == undefined) {
            notyf.open({type: "warning", message: "Seleccione el producto"});
            return;
        }


        tooths.each((i, element) => {
            if ($(element).prop("checked") == true) {
                let value = $(element).val();
                tooths_array.push(value);
            }
        });


        let regMor = $('#regMor').prop('checked');
        let antagon = $('#antagon').prop('checked');

        new_order.name_paciente = name_paciente;
        new_order.dentista = dentist;
        new_order.fecha_entrante = fecha_entrada;
        new_order.fecha_saliente = fecha_salida;
        new_order.comentario = comentario;
        new_order.regMor = regMor;
        new_order.antagon = antagon;

        new_order_details.cantidad = cantidad;
        new_order_details.color = color_name;
        new_order_details.tooths = tooths_array;
        new_order_details.producto_name = producto_name;

        api_conection(
            "POST",
            "api/orders/new_order",
            {new_order, new_order_details},
            function (data) {
                let data_order = data.data;
                notyf.success("Orden  " + data_order.id_order + "  creada con exito");
                clean_input();
                drawLastOrder(data_order.id_order)
            }
        );
    });

    $(".btn-check").click(function () {
        let typeBtn = $(this).attr('typeBtn')
        count_tooth(typeBtn)
    });

    //---------------------- EDITAR ULTIMA ORDER ---------------------------------//


    $('.editDataOrder').change(function () {
        let id_orden = $(this).attr('id_orden')
        let folio = $(this).attr('folio')
        let body = {}


        body.dentista = $('#dentistaOrder').val()
        body.name_paciente = $('#pacienteOrder').val()
        body.fecha_entrante = $('#fechaEntranteLast').val()
        body.fecha_saliente = $('#fechaSalienteLast').val()
        body.regMor = $('#regMorLast').prop('checked')
        body.antagon = $('#antagonLast').prop('checked')


        api_conection('PUT', '/api/orders/edit_data_order/' + id_orden, {body}, function (response) {
            notyf.success(response.message)
            drawLastOrder(folio)


        }, function (response) {
            notyf.error(response.message)
            drawLastOrder(folio)
        })

    })


    $(document.body).on('click', '.edit_product', function () {
        clean_input()
        let dientes = $(this).attr('dientesEdit')
        let color = $(this).attr('colorEdit')
        let producto = $(this).attr('productoEdit')
        let id_detalle = $(this).attr('id_detalle')
        let folio = $(this).attr('folio')
        let body = {}


        dientes = dientes.split(",");


        $('#producto_nameEdit').val(producto)
        $('#color_nameEdit').val(color)
        $('#countEdit').text(dientes.length)

        $('#saveEditProduct').attr('id_detalle', id_detalle)
        $('#saveEditProduct').attr('folio', folio)

        for (let item of dientes) {

            $('#toothEdit_' + item).prop('checked', true)
        }

        $('#editProductModal').modal('show')


    })

    $(document.body).on('click', '#saveEditProduct', function () {

        let id_detalle = $(this).attr('id_detalle')
      
        let folio = $(this).attr('folio')

        let body = {}
        let tooths_array = [];


        body.producto_name = $('#producto_nameEdit').val()
        body.color = $('#color_nameEdit').val()
        body.cantidad = $('#countEdit').text()
        let tooths = $(".btn-check");

        if (body.producto_name == "" || body.producto_name == undefined) {
            notyf.open({type: "warning", message: "Seleccione el producto"});
            return;
        }

        tooths.each((i, element) => {
            if ($(element).prop("checked") == true) {
                let value = $(element).val();
                tooths_array.push(value);
            }


        });

        body.tooths = tooths_array;


        api_conection('PUT', '/api/orders/editProductDetail/' + id_detalle, {body}, function (response) {
            notyf.success(response.message)
            drawLastOrder(folio)
            $('#editProductModal').modal('hide')


        }, function (response) {
            notyf.error(response.message)
            drawLastOrder(folio)
        })
    })

    $(document.body).on('click', '.delete_product', function () {
        let id_detalle = $(this).attr('id_detalle')
        let id_orden = $(this).attr('id_orden')
        let folio = $(this).attr('folio')


        Swal.fire({
            title: "¿Seguro que desea eliminar este producto? ",
            text: "Esta acción no tiene regreso",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#006f2c",
            cancelButtonColor: "#e80303",
            confirmButtonText: "Si Adelante!",
            cancelButtonText: "Cancelar",
        }).then((confirmacionTrue) => {

            if (confirmacionTrue.value) {

                api_conection('POST', '/api/orders/delete_detailsProduct/' + id_detalle + '/' + id_orden, {}, function (response) {
                    notyf.success(response.message)
                    drawLastOrder(folio)

                }, function (response) {
                    notyf.error(response.message)
                    drawLastOrder(folio)
                })


            }

        })


    })

    $('.change_status').change(function () {
        let status = $(this).val()
        let id_orden = $(this).attr('id_orden')
        let status_actual = $(this).attr('status_actual')
        let folio = $(this).attr('folio')


        if (status_actual == status) {
            notyf.open({type: "warning", message: "Esta orden ya se encuentra en el status seleccionado"});

            return
        }


        Swal.fire({
            title: "Cambio de status  ",
            text: "Se actualizara el status de esta orden",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#006f2c",
            cancelButtonColor: "#e80303",
            confirmButtonText: "Si Adelante!",
            cancelButtonText: "Cancelar",
        }).then((confirmacionTrue) => {

            if (confirmacionTrue.value) {

                api_conection("PUT", "api/orders/change_status/" + id_orden, {status}, function (response) {
                    notyf.success(response.message)
                    drawLastOrder(folio)

                }, function (response) {
                    notyf.error(response.message)
                    drawLastOrder(folio)

                })


            } else {
                $('#statusLast').val(status_actual)

            }

        });
    })


    let drawOptionsProductoEdit = function (search) {
        api_conection(
            "POST",
            "api/products/search_product",
            {search},
            function (data) {
                let products_list = data.data;
                for (let item of products_list) {
                    $("#producto_optionEdit").append(
                        '<option id_product="' +
                        item._id +
                        '" value="' +
                        item.name_producto +
                        '">' +
                        item.name_producto +
                        "</option>"
                    );
                }
            }
        );
    };

    let drawOptionsColorEdit = function (search) {
        api_conection(
            "POST",
            "api/products/search_color",
            {search},
            function (data) {
                let colors_list = data.data;
                for (let item of colors_list) {
                    $("#color_optionEdit").append(
                        '<option id_product="' +
                        item._id +
                        '" value="' +
                        item.name_color +
                        '">' +
                        item.name_color +
                        "</option>"
                    );
                }
            }
        );
    };

    $('.add_products').click(function () {
        let id_orden = $(this).attr('id_order')
        let folio = $(this).attr('folio')
        clean_input()
        $('#agregar_productModal').modal('show')

        $('.save_newProduct').attr('id_orden', id_orden)
        $('.save_newProduct').attr('folio', folio)

    })

    $('.save_newProduct').click(function () {
        let folio = $(this).attr('folio')
        let id_orden = $(this).attr('id_orden')
        add_product(id_orden, folio)


    })

    $('#searchOrders').change(function () {
        let value = $(this).val()


        drawLastOrder(value)


    })

    $('#btnSearch').change(function () {
        let value = $("#searchOrders").val()


        drawLastOrder(value)


    })

    //IMPRIMIR ORDEN
    $("#imprimirOrder").click(function () {
        let id_orden = $(this).attr('id_order')

        let logo = '../public/img/logo.jpg'

        api_conection("POST", "api/orders/details_order/" + id_orden, {}, function (data) {


            let data_order = data.data

            let status = asignament_status(data_order.status)

            let datos_generales = '<div class=" card-body text-start ">'


                + '<div class="row ">'
                + '<div class="col-7">'

                + '<h5 class=" fw-bold ">Dentista:   <span  style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + data_order.name_dentista + '</span></h5>'
                + '<h5 class=" fw-bold ">Entrada: <br> <span  style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + moment(data_order.fecha_entrante, 'DD-MM-YYYY').format('dddd DD MMMM YYYY') + '</span></h5>'
                + '<h5 class=" fw-bold ">Salida: <br>  <span  style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + moment(data_order.fecha_saliente, 'DD-MM-YYYY').format('dddd DD MMMM YYYY') + '</span></h5>'


                + '</div>'
                + '<div class="col-5 ">'

                + '<h5 class="text-start  fw-bold ">Folio:  <mark style="color:' + data_order.dentista_color + ';"  class="fw-bold">' + data_order.id_order + '</mark></h5>'
                + '<h5 class=" fw-bold ">Paciente:   <span style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + data_order.name_paciente.toUpperCase() + '</span></h5>'


                + '</div>'
                + '</div>'


                + '<div class="row ">'

                + '<div class="col-6">'

                + '<br><h5 class="text-start  fw-bold ">Regreso: </h5><input type="text"></input>'


                + '</div>'

                + '<div class="col-6">'

                + '<br><h5 class="text-start fw-bold ">Entrega: </h5><input type="text"></input>'


                + '</div>'


                + '</div>'

                + '<div class="row my-4">'

                + '<div class="col-6">'

                + '<h5 class=" fw-bold ">Registro Mordida:   <span style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + (data_order.regMor ? 'SI' : 'NO') + '</span></h5>'
                + '</div>'

                + '<div class="col-6">'

                + '<h5 class=" fw-bold ">Antagonista:   <span style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + (data_order.antagon ? 'SI' : 'NO') + '</span></h5>'

                + '</div>'


                + '</div>'




            let productos = ''

            for (let item of data_order.products) {

                let tooths_10_20 = ''
                let tooths_30_40 = ''


                for (let od of item.tooths) {

                    let parrafo_od_10_20 = ''
                    let parrafo_od_30_40 = ''


                    od = Number(od)

                    if (od >= 11 && od <= 18) {
                        parrafo_od_10_20 = '<span class="text-primary fs-5 fw-bolder">' + od + '&nbsp;  </span>'


                    }
                    if (od >= 21 && od <= 28) {
                        parrafo_od_10_20 = '<span class="text-danger fs-5 fw-bolder">' + od + '&nbsp;    </span>'

                    }
                    if (od >= 31 && od <= 38) {
                        parrafo_od_30_40 = '<span class="text-warning fs-5 fw-bolder">' + od + '&nbsp;   </span>'

                    }
                    if (od >= 41 && od <= 48) {
                        parrafo_od_30_40 = '<span class="text-success fs-5 fw-bolder">' + od + '&nbsp;   </span>'

                    }

                    tooths_10_20 = tooths_10_20 + parrafo_od_10_20
                    tooths_30_40 = tooths_30_40 + parrafo_od_30_40

                }


                productos = productos + '<hr class="py-2"><div  class="text-center">'
                    + '<div class="row">'
                    + '<div class="col-3">'
                    + '<h5 class="fw-bold">Cantidad</h5>'
                    + '<h5>' + item.cantidad + '</h5>'

                    + '</div>'
                    + '<div class="col-2">'
                    + '<h5 class="fw-bold" >Color</h5>'
                    + '<h5>' + item.color + '</h5>'


                    + '</div>'
                    + '<div class="col-7">'
                    + '<h5 class="fw-bold" >Producto</h5>'
                    + '<h5 style="color:' + item.dentista_color + ';">' + item.name_producto + '</h5>'


                    + '</div>'

                    + '</div>'
                    + '</div>'

                    + '<div  class="text-center">'

                    + tooths_10_20
                    + '<br>'
                    + tooths_30_40
                    + '</div>'


            }

            let comentarios = '<hr class="py-2"><h3 class="text-center my-2 fw-bold" >Comentarios:</h3>'
                + '<div style="border:solid;border-color:' + data_order.dentista_color + ';" class="text-center p-5">'
                + '<h5 class="p-0 m-0" style="color:' + data_order.dentista_color + ';">' + data_order.comentario + '</h5>'
                + '</div>'
                + '</div>'
                + '</div>'

            var ticketHTML = '<div class="card">'

                + '<div class="card-header">'
                + '<div class="row text-center">'

                + '</div>'
                + '</div>'

                + datos_generales
                + productos
                + comentarios

                + '<div class="col-12 text-end my-5 fixed-bottom">' +
                '<br>' +
                '<br>' +
                '<br>' +
                '<br>'

                + '<img class="img-fluid p-0 mx-4" style="max-height:90px;" src="' + logo + '"></img>'
                + '</div>'
                + '</div>'


            let headerHTML = '<!doctype html><html lang="es"><head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"></head><body>'
            let footerHTML = "<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.min.js' integrity='sha384-7VPbUDkoPSGFnVtYi0QogXtr74QeVeeIs99Qfg5YCF+TidwNdjvaKZX19NZ/e6oz' crossorigin='anonymous'></script></body></html>"


            ImprimirTicket(headerHTML, ticketHTML, footerHTML)

        })


    })


    let search = '';

    drawOptionsDentist(search);

    drawOptionsProducto(search);
    drawOptionsColor(search);

    drawOptionsProductoEdit(search)
    drawOptionsColorEdit(search)
    drawLastOrder(search)

});
