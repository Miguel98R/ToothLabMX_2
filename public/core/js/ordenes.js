verificador();

$(document).ready(function () {
    let today = moment().format("DD-MM-YYYY");

    $(".date_entrada").datepicker({language: "es", format: "dd-mm-yyyy", startDate: 'd'}).val(today);

    $(".date_entrada").datepicker('setDate', today);

    $(".date_salida").datepicker({language: "es", format: "dd-mm-yyyy", startDate: 'd'});

    $("#fechaSalienteLast").datepicker({language: "es", format: "dd-mm-yyyy", startDate: 'd'});


    $(".saved_order").click(function () {
        let tooths = $(".btn-check");
        let dentist = $(".dentistas_name").val();
        let name_paciente = $(".paciente_name").val();
        let fecha_entrada = $(".date_entrada").val();
        let fecha_salida = $(".date_salida").val();
        let cantidad = $(".count_tooths").text();
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
        if (name_paciente == "" || name_paciente == undefined) {
            notyf.open({type: "warning", message: "Ingresa el paciente"});
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

        new_order.name_paciente = name_paciente;
        new_order.dentista = dentist;
        new_order.fecha_entrante = fecha_entrada;
        new_order.fecha_saliente = fecha_salida;
        new_order.comentario = comentario;

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
                drawLastOrder()
            }
        );
    });

    $(".btn-check").click(function () {
        let typeBtn = $(this).attr('typeBtn')
        count_tooth(typeBtn)
    });

    //---------------------- EDITAR ULTIMA ORDER ---------------------------------//

    let drawLastOrder = function () {

        api_conection('GET', 'api/orders/last_order/', {}, function (data) {


            let order_data = data.data
            console.log(order_data)
            for (let item of order_data) {

                $('#dentistaOrder').val(item.dentista)
                $('#Folio').text(item.folio)
                $('#pacienteOrder').val(item.paciente)
                $('#fechaEntranteLast').val(item.fecha_entrante)


                $('#fechaSalienteLast').val(item.fecha_saliente)



                $('#comentLast').val(item.comentario)
                $('#statusLast').val(item.status)

                $('#statusLast').attr('id_orden', item._id)
                $('#statusLast').attr('status_actual', item.status)

                $('#gridProductos').html('')

                $('.editDataOrder').attr('id_orden', item._id)



                for (let jtem of item.detalle) {

                    let button_delete
                    let button_edit

                    if (item.status == 6 || item.status == 7 || item.status == 4) {
                        button_delete = ''
                        button_edit = ''


                    } else {
                        button_delete = '<button id_orden="' + item._id + '" id_detalle="' + jtem.detalle._id + '" class=" my-1 btn btn-block btn-danger  delete_product btn_delete_' + jtem.detalle._id + '"><i class="fas fa-trash-alt"></i></button>'
                        button_edit = '<button colorEdit="' + jtem.detalle.color + '" productoEdit="' + jtem.detalle.producto.name_producto + '" dientesEdit="' + jtem.detalle.tooths + '" id_orden="' + item._id + '" id_detalle="' + jtem.detalle._id + '" class=" my-1 btn btn-warning  btn-block  edit_product btn_edit_' + jtem.detalle._id + '"><i class="fas fa-edit fa-rotate-270 fa-sm"></i></button>'
                    }

                    let tooths_10_20 = ''
                    let tooths_30_40 = ''

                    for (let od of jtem.detalle.tooths) {

                        let parrafo_od_10_20 = ''
                        let parrafo_od_30_40 = ''

                        od = Number(od)

                        if (od >= 11 && od <= 18) {
                            parrafo_od_10_20 = '<span class="text-primary fs-5">' + od + '&nbsp;  </span>'

                        }
                        if (od >= 21 && od <= 28) {
                            parrafo_od_10_20 = '<span class="text-danger fs-5">' + od + '&nbsp;    </span>'

                        }
                        if (od >= 31 && od <= 38) {
                            parrafo_od_30_40 = '<span class="text-warning fs-5">' + od + '&nbsp;   </span>'

                        }
                        if (od >= 41 && od <= 48) {
                            parrafo_od_30_40 = '<span class="text-success fs-5">' + od + '&nbsp;   </span>'

                        }

                        tooths_10_20 = tooths_10_20 + parrafo_od_10_20
                        tooths_30_40 = tooths_30_40 + parrafo_od_30_40

                    }


                    $('#gridProductos').append('<div class="col-6 my-2">'
                        + '<div class="card">'
                        + '<div class="card-header bg-dark text-white"> '
                        + '<div class="row ">'
                        + '<div class="col-8">'
                        + '<h6 class="fw-bold m-0 p-0 ">' + jtem.detalle.producto.name_producto + '</h6>'
                        + '</div>'
                        + '<div class="col-4 text-end">'
                        + button_delete
                        + button_edit
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '<div class="card-body text-center"> '
                        + '<small class="fw-bold">OD</small>'
                        + '<p>--------------------------</p>'
                        + tooths_10_20
                        + '<br>'
                        + tooths_30_40
                        + '<p>--------------------------</p>'
                        + '</div>'
                        + '<div class="card-footer"> '

                        + '<div class="row text-center">'
                        + '<div class="col-6">'
                        + '<small class="fw-bold">CANTIDAD</small>'
                        + '<p class="fw-normal">' + jtem.detalle.cantidad + '</p>'
                        + '</div>'
                        + '<div class="col-6">'
                        + '<small class="fw-bold">COLOR</small>'
                        + '<p class="fw-normal">' + jtem.detalle.color + '</p>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</div>'

                        + '</div>')


                }


            }


        }, function (response) {

            let order_data = response.data.data
            console.log(order_data)

            if (order_data == undefined) {
                $('#inputsLastOrder').html('')
                $('#inputsLastOrder').append('<div class="alert alert-warning" role="alert">' +
                    'Aun no realizas ordenes ' +
                    '</div>')

            }

        })

    }

    $('.editDataOrder').change(function () {
        let id_orden = $(this).attr('id_orden')
        let body = {}


        body.dentista =  $('#dentistaOrder').val()
        body.name_paciente = $('#pacienteOrder').val()
        body.fecha_entrante = $('#fechaEntranteLast').val()
        body.fecha_saliente = $('#fechaSalienteLast').val()
        body.comentario = $('#comentLast').val()

        api_conection('PUT', '/api/orders/edit_data_order/' + id_orden, {body}, function (response) {
            notyf.success(response.message)
            drawLastOrder(id_orden)



        }, function (response) {
            notyf.error(response.message)
            drawLastOrder(id_orden)
        })

    })






    $(document.body).on('click', '.edit_product', function () {
        clean_input()
        let dientes = $(this).attr('dientesEdit')
        let color = $(this).attr('colorEdit')
        let producto = $(this).attr('productoEdit')
        let id_detalle = $(this).attr('id_detalle')
        let body = {}


        dientes = dientes.split(",");

        console.log(dientes)
        console.log(color)
        console.log(producto)


        $('#producto_nameEdit').val(producto)
        $('#color_nameEdit').val(color)
        $('#countEdit').text(dientes.length)

        $('#saveEditProduct').attr('id_detalle', id_detalle)

        for (let item of dientes) {
            console.log("item editar----", item)
            $('#toothEdit_' + item).prop('checked', true)
        }

        $('#editProductModal').modal('show')


    })

    $(document.body).on('click', '#saveEditProduct', function () {

        let id_detalle = $(this).attr('id_detalle')
        let id_orden = $(this).attr('id_orden')
        let body = {}
        let tooths_array = [];


        body.producto_name = $('#producto_nameEdit').val()
        body.color = $('#color_nameEdit').val()
        body.cantidad = $('#countEdit').text()
        let tooths = $(".btn-check");

        if (body.producto_name  == "" || body.producto_name == undefined) {
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
            drawLastOrder(id_orden)
            $('#editProductModal').modal('hide')


        }, function (response) {
            notyf.error(response.message)
            drawLastOrder(id_orden)
        })
    })

    $(document.body).on('click', '.delete_product', function () {
        let id_detalle = $(this).attr('id_detalle')
        let id_orden = $(this).attr('id_orden')

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
                    drawLastOrder(id_orden)

                }, function (response) {
                    notyf.error(response.message)
                    drawLastOrder(id_orden)
                })


            }

        })


    })

    $('.change_status').change(function () {
        let status = $(this).val()
        let id_orden = $(this).attr('id_orden')
        let status_actual = $(this).attr('status_actual')


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
                    drawLastOrder(id_orden)

                }, function (response) {
                    notyf.error(response.message)
                    drawLastOrder(id_orden)

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


    let search = "";

    drawOptionsDentist(search);

    drawOptionsProducto(search);
    drawOptionsColor(search);

    drawOptionsProductoEdit(search)
    drawOptionsColorEdit(search)

    drawLastOrder()
});
