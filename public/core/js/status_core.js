verificador();

$(document).ready(function () {

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
            data: "paciente"
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

        api_conection('PUT','/api/orders/edit_data_order/'+id_orden,{body},function (response) {
            notyf.success(response.message)
            //draw_modal_details(id_orden)

        },function (response) {
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

                api_conection('POST','/api/orders/delete_detailsProduct/'+id_detalle +'/'+id_orden,{},function (response) {
                    notyf.success(response.message)
                    draw_modal_details(id_orden)

                },function (response) {
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
    $(document.body).on('click', '.imprimir_order', function (){
        let id_orden = $(this).attr('id_order')

        let logo = '../public/img/logo.jpg'

        api_conection("POST", "api/orders/details_order/" + id_orden, {}, function (data) {


            let data_order = data.data

            let status = asignament_status(data_order.status)

            let datos_generales = '<div class=" card-body text-start ">'


                + '<div class="row ">'
                + '<div class="col-7">'

                + '<h5 style="color:' + data_order.dentista_color + ';" class=" fw-bold ">Dentista:   <span class="fw-bold text-dark">' + data_order.name_dentista + '</span></h5>'
                + '<h5 style="color:' + data_order.dentista_color + ';" class=" fw-bold ">Entrada: <br> <span class="fw-bold text-dark">' + moment(data_order.fecha_entrante, 'DD-MM-YYYY').format('dddd DD MMMM YYYY') + '</span></h5>'
                + '<h5 style="color:' + data_order.dentista_color + ';" class=" fw-bold ">Salida: <br>  <span class="fw-bold text-dark">' + moment(data_order.fecha_saliente, 'DD-MM-YYYY').format('dddd DD MMMM YYYY') + '</span></h5>'



                + '</div>'
                + '<div class="col-5 my-3">'

                + '<h5 style="color:' + data_order.dentista_color + ';" class="text-start  fw-bold ">Folio:  <mark class="fw-boldtext-dark">' + data_order.id_order + '</mark></h5>'
                + '<h5 style="color:' + data_order.dentista_color + ';" class="text-start fw-bold ">Status:  <mark class="fw-bold text-dark">' + status + '</mark></h5>'
                + '<h5 style="color:' + data_order.dentista_color + ';" class=" fw-bold ">Paciente:   <span class="fw-bold text-dark">' + data_order.name_paciente + '</span></h5>'


                + '</div>'
                + '</div>'


                + '<div class="row ">'

                + '<div class="col-6">'

                + '<br><h5 style="color:' + data_order.dentista_color + ';" class="text-start  fw-bold ">Regreso: </h5><input type="text"></input>'


                + '</div>'

                + '<div class="col-6">'

                + '<br><h5 style="color:' + data_order.dentista_color + ';" class="text-start fw-bold ">Entrega: </h5><input type="text"></input>'


                + '</div>'


                + '</div>'
                + '<div class="row my-4">'

                + '<div class="col-6">'

                + '<h5 style="color:' + data_order.dentista_color + ';" class=" fw-bold ">Registro Mordida:   <span class="fw-bold text-dark">' + (data_order.regMor ? 'SI' : 'NO') + '</span></h5>'
                + '</div>'

                + '<div class="col-6">'

                + '<h5 style="color:' + data_order.dentista_color + ';" class=" fw-bold ">Antagonista:   <span class="fw-bold text-dark">' + (data_order.antagon ? 'SI' : 'NO')  + '</span></h5>'

                + '</div>'


                + '</div>'

                + '<h3 class="text-center my-5 fw-bold"  >Detalle orden:</h3>'


            let productos = ''

            for (let item of data_order.products) {

                let tooths_10_20 = ''
                let tooths_30_40 = ''


                for (let od of item.tooths) {

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


                productos = productos + '<div  class="text-center">'
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

                    + '<h5 class="text-center my-3 fw-bold"  >OD:</h5>'

                    + '<div  class="text-center">'

                    + tooths_10_20
                    + '<br>'
                    + tooths_30_40
                    + '</div>'


            }

            let comentarios = '<h3 class="text-center my-3 fw-bold" >Comentarios:</h3>'
                + '<div style="border:solid;border-color:' + data_order.dentista_color + ';" class="text-center p-5">'
                + '<h5 class="p-0 m-0"style="color:' + data_order.dentista_color + ';">' + data_order.comentario + '</h5>'
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
                '<br>'+
                '<br>'+
                '<br>'+
                '<br>'

                + '<img class="img-fluid p-0 mx-4" style="max-height:90px;" src="' + logo + '"></img>'
                + '</div>'
                + '</div>'


            let headerHTML = '<!doctype html><html lang="es"><head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"></head><body>'
            let footerHTML = "<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.min.js' integrity='sha384-7VPbUDkoPSGFnVtYi0QogXtr74QeVeeIs99Qfg5YCF+TidwNdjvaKZX19NZ/e6oz' crossorigin='anonymous'></script></body></html>"


            ImprimirTicket(headerHTML, ticketHTML, footerHTML)

        })


    })




    $(".btn-check").click(function () {
        count_tooth()
    });

    let search = "";

    drawOptionsProducto(search);
    drawOptionsColor(search);


});

