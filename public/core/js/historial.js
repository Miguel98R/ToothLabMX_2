verificador();


$(document).ready(function () {

    let columns = [
        {
            width: "10%",
            data: "id_order",

        },
        {
            width: "15%",
            data: "fecha_entrada",
            render: function (data, v, row) {
                return moment(data, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY')

            }

        },
        {
            width: "15%",
            data: "fecha_actualizacion",
            render: function (data, v, row) {
                return moment(data, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY')

            }

        },
        {
            width: "15%",
            data: "dentista"
        },
        {
            width: "5%",
            data: "paciente"
        },
        {
            width: "10%",
            data: "status",
            render: function (data, row) {
                let status_text = asignament_status(data)
                return status_text
            }
        },
        {
            width: "5%",
            data: "_id",
            render: function (data, row) {
                return '<button id_order="' + data + '" class="btn-sm btn-block text-white btn btn-info see_details">Ver detalles</button>' +
                    '<button id_order="' + data + '"  class="btn-sm btn-block text-white btn btn-secondary my-2  imprimir_order">Imprimir</button>'
            }
        },
    ];

    let dt = $("#tbl-historial").DataTable({
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

        order: [[1, 'desc'], [2, 'desc']],

        pageLength: 5,

        columns: columns,

        scrollY: 470,
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        fixedHeader: true,
    });

    let data_historico;

    //DATA PARA PINTAR DATATABLES

    let dt_draw = function () {
        api_conection("GET", "api/historial/data_dataTables", {}, function (data) {
            data_historico = data.data;
            console.log("data_dataTables>>>>>>>>", data_historico);

            dt.clear();
            dt.rows.add(data_historico).draw();
        });
    };

    dt_draw()

    //DETALLES DE LA ORDEN

    $(document.body).on('click', '.see_details', function () {

        let id_orden = $(this).attr('id_order')
        $('#detailsOrder_modal').modal('show')

        $('.details_general_order').html('')
        $('.details_product_order').html('')
        $('.comentario').html('')


        draw_modal_details(id_orden)

    })

    let draw_modal_details = function (id) {

        api_conection("POST", "api/orders/details_order/" + id, {}, function (data) {
            let data_order = data.data;

            console.log(data_order)

            for (let data_general of data_order) {
                let status = asignament_status(data_general.status)


                $('.details_general_order').append('<div>'

                    + '<div class="row">'

                    + '<div class="col-6">'
                    + '<p class="fw-bold">Folio: <span class="fw-normal"> ' + data_general.id_order + '</span></p>'
                    + '<p class="fw-bold">  Fecha de entrada: <span class="fw-normal">' + moment(data_general.fecha_entrante, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</span></p>'
                    + '<p class="fw-bold"> Fecha salida: <span class="fw-normal">' + moment(data_general.fecha_saliente, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</span></p>'


                    + '</div>'
                    + '<div class="col-6">'
                    + '<p class="fw-bold">  Dentista: <span class="fw-normal">' + data_general.name_dentista + '</span></p>'
                    + '<p class="fw-bold">  Paciente: <span class="fw-normal">' + data_general.name_paciente + '</span></p>'
                    + '<p class="fw-bold">  Status: <span class="fw-normal">' + status + '</span></p>'
                    + '</div>'

                    + '</div>'

                    + '</div>')

                let tooths_10_20 = ''
                let tooths_30_40 = ''


                for (let od of data_general.tooths) {

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


                $('.details_product_order').append('<div class=""text-center>'
                    + '<div class="row text-center">'
                    + '<div class="col-3">'
                    + '<p class="fw-bold">CANTIDAD</p>'

                    + '<p class="fw-normal">' + data_general.cantidad + '</p>'
                    + '</div>'
                    + '<div class="col-6">'
                    + '<p class="fw-bold">PRODUCTO</p>'


                    + '<p class="fw-normal">' + data_general.name_producto + '</p>'
                    + '</div>'
                    + '<div class="col-3">'
                    + '<p class="fw-bold">COLOR</p>'


                    + '<p class="fw-normal">' + data_general.color + '</p>'
                    + '</div>'
                    + '</div>'

                    + '<div class="col-12 text-center">'
                    + '<p class="fw-bold">OD</p>'
                    + tooths_10_20
                    + '<br>'
                    + tooths_30_40
                    + '</div>'

                    + '</div>')


                $('.comentario').text(data_general.comentario)

            }


        });

    }

    $(document.body).on('click', '.imprimir_order', function () {
        let id_orden = $(this).attr('id_order')

        let logo = '../public/img/logo.jpg'

        api_conection("POST", "api/orders/details_order/" + id_orden, {}, function (data) {


            let data_order = data.data

            console.log(data_order)

            let detalle = ''

            for (let item of data_order) {

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

                let status = asignament_status(item.status)

                detalle = '<div class=" card-body text-start ">'


                    + '<div class="row ">'

                    + '<div class="col-7">'

                    + '<h5 style="color:' + item.dentista_color + ';" class=" fw-bold my-2 ">Entrada:  <span class="fw-bold text-dark">' + moment(item.fecha_entrante, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</span></h5>'
                    + '<h5 style="color:' + item.dentista_color + ';" class=" fw-bold ">Salida:  <span class="fw-bold text-dark">' + moment(item.fecha_saliente, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</span></h5>'

                    + '</div>'

                    + '<div class="col-5 ">'

                    + '<h5 style="color:' + item.dentista_color + ';" class="text-start my-2  fw-bold ">Folio:  <mark class="fw-boldtext-dark">' + item.id_order + '</mark></h5>'
                    + '<h5 style="color:' + item.dentista_color + ';" class="text-start fw-bold ">Status:  <mark class="fw-bold text-dark">' + status + '</mark></h5>'

                    + '</div>'


                    + '</div>'

                    + '<div class="row my-2">'

                    + '<div class="col-7">'

                    + '<h5 style="color:' + item.dentista_color + ';" class=" fw-bold ">Dentista:   <span class="fw-bold text-dark">' + item.name_dentista + '</span></h5>'


                    + '</div>'

                    + '<div class="col-5 ">'
                    + '<h5 style="color:' + item.dentista_color + ';" class=" fw-bold ">Paciente:   <span class="fw-bold text-dark">' + item.name_paciente + '</span></h5>'

                    + '</div>'

                    + '</div>'

                    + '<div class="row my-2">'

                    + '<div class="col-6">'

                    + '<br><h5 style="color:' + item.dentista_color + ';" class="text-start  fw-bold ">Regreso: </h5><input type="text"></input>'


                    + '</div>'

                    + '<div class="col-6">'

                    + '<br><h5 style="color:' + item.dentista_color + ';" class="text-start fw-bold ">Entrega: </h5><input type="text"></input>'


                    + '</div>'


                    + '</div>'

                    + '<h3 class="text-center my-3 fw-bold"  >Detalle orden:</h3>'
                    + '<div  class="text-center">'
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


                    + '</div>'


                    + '<h3 class="text-center my-3 fw-bold" >Comentarios:</h3>'
                    + '<div style="border:solid;border-color:' + item.dentista_color + ';" class="text-center p-5">'
                    + '<h5 class="p-0 m-0"style="color:' + item.dentista_color + ';">' + item.comentario + '</h5>'
                    + '</div>'


                    + '</div>'


            }

            var ticketHTML = '<div class="card">'

                + '<div class="card-header">'
                + '<div class="row text-end">'
                + '<div class="col-12 ">'
                + '<img class="img-fluid p-0 mx-3" style="max-height:90px;" src="' + logo + '"></img>'
                + '<h2 class="text-dark mx-2 my-2">Orden de trabajo</h2>'
                + '</div>'

                + '</div>'
                + '</div>'


                + detalle


                + '</div>'


            let headerHTML = "<!doctype html><html lang='es'><head><link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC\" crossorigin=\"anonymous\"></head><body>"
            let footerHTML = "<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.min.js' integrity='sha384-7VPbUDkoPSGFnVtYi0QogXtr74QeVeeIs99Qfg5YCF+TidwNdjvaKZX19NZ/e6oz' crossorigin='anonymous'></script></body></html>"


            ImprimirTicket(headerHTML, ticketHTML, footerHTML)

        })


    })


    let ImprimirTicket = function (headerHTML, htmlCreado, footerHTML) {


        let content_finished = headerHTML + htmlCreado + footerHTML

        var WinPrint = window.open('', '', 'width=630,height=560,scrollbars=1,menuBar=1');
        WinPrint.document.write(content_finished);
        WinPrint.document.close();
        WinPrint.focus();
        setTimeout(() => {
            WinPrint.print();
            WinPrint.close();
        }, "580")


    }


});

