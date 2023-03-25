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


        body.dentista =  $('#dentistaOrder').val()
        body.name_paciente = $('#pacienteOrder').val()
        body.fecha_entrante = $('#fechaEntranteLast').val()
        body.fecha_saliente = $('#fechaSalienteLast').val()
        body.comentario = $('#comentLast').val()

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
        let body = {}


        dientes = dientes.split(",");



        $('#producto_nameEdit').val(producto)
        $('#color_nameEdit').val(color)
        $('#countEdit').text(dientes.length)

        $('#saveEditProduct').attr('id_detalle', id_detalle)

        for (let item of dientes) {

            $('#toothEdit_' + item).prop('checked', true)
        }

        $('#editProductModal').modal('show')


    })

    $(document.body).on('click', '#saveEditProduct', function () {

        let id_detalle = $(this).attr('id_detalle')
        let id_orden = $(this).attr('id_orden')
        let folio = $(this).attr('folio')

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

    $('.add_products').click( function () {
        let id_orden = $(this).attr('id_order')
        clean_input()
        $('#agregar_productModal').modal('show')

        $('.save_newProduct').attr('id_orden', id_orden)

    })

    $('.save_newProduct').click(function () {
        let folio = $(this).attr('folio')
        let id_orden = $(this).attr('id_orden')
        add_product(folio)



    })

    $('#searchOrders').keyup(function(){
        let value = $(this).val()

        drawLastOrder(value)


    })


    let search = '';

    drawOptionsDentist(search);

    drawOptionsProducto(search);
    drawOptionsColor(search);

    drawOptionsProductoEdit(search)
    drawOptionsColorEdit(search)
    drawLastOrder(search)

});
