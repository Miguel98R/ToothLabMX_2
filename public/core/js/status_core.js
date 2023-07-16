verificador();

$(function () {

    $(".date_salida").datepicker({language: "es", format: "dd-mm-yyyy", startDate: 'd'});

    //COLUMNAS DE LA DATATABLE
    let columns = [
        {
            width: "10%",
            data: "id_order",

        },
        {
            width: "15%",
            data: "fecha_entrada",
            render: function (data, v, row) {
                return '<p>' + moment(data, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</p>' +
                    '<small>Ultima actualizacion de la order: ' + moment(row.fecha_actualizacion, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</small>'

            }

        },
        {
            width: "15%",
            data: "fecha_saliente",
            render: function (data, v, row) {
                return moment(data, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY')

            }

        },
        {
            width: "5%",
            data: "dentista",
            render: function (data, v, row) {
                return '<p class="fw-bolder" style="color:' + row.distintivo_color + ' ;">' + data + '</p>'

            }
        },
        {
            width: "5%",
            data: "paciente",
            render: function (data, v, row) {
                return data.toUpperCase()
            }
        },
        {
            width: "15%",
            data: "status",
            render: function (data, v, row) {
                let status_text = asignament_status(data)
                return '<h5>' + status_text + '</h5>' + '<div><label>Cambiar status:</label>  ' +
                    '<select status_actual="' + data + '" id_orden="' + row._id + '" class="custom-select change_status">' +
                    '<option class="text-primary" value="0">Selecciona un status</option>' +
                    '<option class="text-primary" value="1">Entrante</option>' +
                    '<option class="text-warning"  value="2">A Prueba</option>' +
                    '<option class="text-secondary"  value="3">Regresada</option>' +
                    '<option class="text-success"  value="4">Terminada</option>' +
                    '<option class="text-info"  value="5">Con cambios</option>' +
                    '<option class="text-danger"  value="6">Cancelada con costos</option>' +
                    '<option class="text-danger"  value="7">Cancelada</option>' +


                    '</select></div>  '
            }
        },
        {
            width: "10%",
            data: "_id",
            render: function (data, v, row) {
                if (row.status == 6 || row.status == 7 || row.status == 4) {
                    return '<button id_order="' + data + '" class="btn-sm btn-block text-white btn btn-info see_details">Ver detalles</button>' +
                        '  <button id_order="' + data + '" class="btn-sm btn-block text-white btn btn-secondary my-2  imprimir_order">Imprimir</button>'

                }
                return '<button id_order="' + data + '" class="btn-sm btn-block text-white btn btn-info see_details">Ver detalles</button>' +
                    //'<button id_order="' + data + '"  class="btn-sm btn-block text-white btn btn-warning my-2  edit_order">Editar datos </button>' +
                    '<button id_order="' + data + '"  style="background:coral ;" class="btn-sm btn-block text-white btn  my-2  add_products">Agregar producto </button>' +
                    '<button id_order="' + data + '"  class="btn-sm btn-block text-white btn btn-secondary my-2  imprimir_order">Imprimir</button>'
            }
        },
    ];

    //CONFIGURACION DE LA DATATABLE
    let dt = $("#" + dt_name).DataTable({
        language: {
            lengthMenu: "Mostrar _MENU_ registros",
            zeroRecords: "No se encontraron resultados",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            sSearch: "Buscar:",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior",
            },
            sProcessing: "Procesando...",
        },
        initComplete: function () {
            $(this.api().table().container())
                .find("input")
                .parent()
                .wrap("<form>")
                .parent()
                .attr("autocomplete", "off");
        },

        data: [],

        lengthMenu: [
            [5, 10, 25, 50, 100, 1000],
            ["5", "10", "25", "50", "100", "1000"],
        ],

        order: [[0, 'desc']],

        pageLength: 5,

        columns: columns,

        scrollY: 470,
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        fixedHeader: true,
    });


    //FUNCION PARA PINTAR DATATABLES
    dt_draw(dt)

    //CAMBIAR DE STATUS
    $(document.body).on('change', '.change_status', function () {
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
                    dt_draw(dt)

                }, function (response) {
                    notyf.error(response.message)
                    dt_draw(dt)
                })


            }

        });
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

    //AGREGAR MAS COMENTARIOS

    $(document.body).on('change', '.comentarios_details', function () {
        let id_orden = $(this).attr('id_orden')
        let body = {}
        body.comentario = $(this).val()

        api_conection('PUT', '/api/orders/edit_data_order/' + id_orden, {body}, function (response) {
            notyf.success(response.message)
            //draw_modal_details(id_orden)

        }, function (response) {
            notyf.error(response.message)
            //draw_modal_details(id_orden)
        })


    })

    //ELIMINAR PRODUCTOS
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
                    draw_modal_details(id_orden)

                }, function (response) {
                    notyf.error(response.message)
                    draw_modal_details(id_orden)
                })


            }

        })


    })


    //AGREGAR NUEVO PRODUCTO

    $(document.body).on('click', '.add_products', function () {
        let id_orden = $(this).attr('id_order')
        clean_input()
        $('#agregar_productModal').modal('show')

        $('.save_newProduct').attr('id_orden', id_orden)

    })


    $('.save_newProduct').click(function () {
        let id_orden = $(this).attr('id_orden')
        add_product(id_orden)

    })


    //IMPRIMIR ORDEN

    $(document.body).on('click', '.imprimir_order', function () {
        let id_orden = $(this).attr('id_order')

        createTicket(id_orden)

    })


    $(".btn-check").click(function () {
        count_tooth()
    });

    let search = "";

    drawOptionsProducto(search);
    drawOptionsColor(search);


});

