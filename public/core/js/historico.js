verificador();

$(function () {

    let apiUrl = 'api/orders'

    //COLUMNAS DE LA DATATABLE
    let columns = [
        {

            data: "folio",

        },
        {

            data: "fecha_entrante",
            render: function (data, v, row) {
                return '<p>' + moment(data, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</p>'
            }

        },
        {

            data: "fecha_actualizacion",
            render: function (data, v, row) {
                return '<p>' + moment(data, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</p>'

            }

        },
        {

            data: "dentista",
            render: function (data, v, row) {
                return '<p class="fw-bolder" style="color:' + row.distintivo_color + ' ;">' + data + '</p>'

            }
        },
        {

            data: "paciente",
            render: function (data, v, row) {
                return data.toUpperCase()
            }
        },

        {
            "data": "detalle",
            "render": function (data, v, row) {
                let products = '';
                for (let jtem of data) {
                    let tooths_10_20 = '';
                    let tooths_30_40 = '';

                    for (let od of jtem.detalle.tooths) {
                        let parrafo_od_10_20 = '';
                        let parrafo_od_30_40 = '';
                        od = Number(od);

                        if (od >= 11 && od <= 18) {
                            parrafo_od_10_20 = '<span class="text-primary fs-5">' + od + '&nbsp;  </span>';
                        }
                        if (od >= 21 && od <= 28) {
                            parrafo_od_10_20 = '<span class="text-danger fs-5">' + od + '&nbsp;    </span>';
                        }
                        if (od >= 31 && od <= 38) {
                            parrafo_od_30_40 = '<span class="text-warning fs-5">' + od + '&nbsp;   </span>';
                        }
                        if (od >= 41 && od <= 48) {
                            parrafo_od_30_40 = '<span class="text-success fs-5">' + od + '&nbsp;   </span>';
                        }

                        tooths_10_20 = tooths_10_20 + parrafo_od_10_20;
                        tooths_30_40 = tooths_30_40 + parrafo_od_30_40;
                    }

                    products = products + '<tr>' +
                        '<td>' + jtem.detalle.producto.name_producto + '</td>' +
                        '<td>' + jtem.detalle.cantidad + '</td>' +
                        '<td><p>' + tooths_10_20 + '</p><p>' + tooths_30_40 + '</p></td>' +
                        '<td>' + jtem.detalle.color + '</td>' +
                        '</tr>';
                }

                return `<table class="display text-center table table-hover">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>ODS</th>
                            <th>Color</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products}
                    </tbody>
                </table>`;
            }
        },

        {
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
            data: "comentario",
            render: function (data, v, row) {
                return data.toUpperCase()
            }
        },
        {
            width: "10%",
            data: "_id",
            render: function (data, v, row) {

                return '<button id_order="' + data + '"  class="btn-sm btn-block text-white btn btn-secondary my-2  imprimir_order">Imprimir</button>'
            }
        },
    ];

    //CONFIGURACION DE LA DATATABLE
    let dt = $("#tbl-historico").DataTable({
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

        scrollY: 500,
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        fixedHeader: true,
    });


    //FUNCION PARA PINTAR DATATABLES
    let dt_draw = function () {
        HoldOn.open(HoldOptions)
        api_conection("GET", apiUrl + "/dt_historic", {}, function (data) {
            HoldOn.close()
            let data_historic = data.data;

            dt.clear();
            dt.rows.add(data_historic).draw();
        });
    };

    dt_draw();


    //IMPRIMIR ORDEN

    $(document.body).on('click', '.imprimir_order', function () {
        let id_orden = $(this).attr('id_order')

        let logo = '../public/img/logo.jpg'

        api_conection("POST", "api/orders/details_order/" + id_orden, {}, function (data) {


            let data_order = data.data

            let status = asignament_status(data_order.status)

            let datos_generales = '<div class=" card-body text-start ">'


                + '<div class="row ">'
                + '<div class="col-12" >'

                + '<div class="row ">'
                + '<div class="col-6" >'
                + '<h5  style="border-bottom: 2px solid ' + data_order.dentista_color + ';"   class=" fw-bold ">Dentista:   <span  style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + data_order.name_dentista + '</span></h5>'

                + '</div>'
                + '<div class="col-6" >'
                + '<h5 style="border-bottom: 2px solid ' + data_order.dentista_color + ';" class="text-start  fw-bold ">Folio:  <cite style="color:' + data_order.dentista_color + ';"  class="fw-bold">' + data_order.id_order + '</cite></h5>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '<div class="col-12" >'
                + '<div class="row ">'
                + '<div class="col-6" >'
                + '<h5 style="border-bottom: 2px solid ' + data_order.dentista_color + ';" class=" fw-bold ">Entrada: <br> <span  style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + moment(data_order.fecha_entrante, 'DD-MM-YYYY').format('dddd DD MMMM YYYY') + '</span></h5>'
                + '<h5 style="border-bottom: 2px solid ' + data_order.dentista_color + ';" class=" fw-bold ">Salida: <br>  <span  style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + moment(data_order.fecha_saliente, 'DD-MM-YYYY').format('dddd DD MMMM YYYY') + '</span></h5>'

                + '</div>'
                + '<div class="col-6" >'
                + '<h5 style="border-bottom: 2px solid ' + data_order.dentista_color + ';" class=" fw-bold ">Paciente:   <span style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + data_order.name_paciente.toUpperCase() + '</span></h5>'
                + '<h5 style="border-bottom: 2px solid ' + data_order.dentista_color + ';" class=" fw-bold ">Fecha Impr.:   <span style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + moment().format('dddd DD MMMM YYYY hh:mm A') + '</span></h5>'

                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'


                + '<div class="row ">'

                + '<div class="col-6 " style="border-bottom: 2px solid ' + data_order.dentista_color + ';">'

                + '<br><h5 class="text-start  fw-bold ">Regreso: </h5>'


                + '</div>'

                + '<div class="col-6 " style="border-bottom: 2px solid ' + data_order.dentista_color + ';">'

                + '<br><h5 class="text-start fw-bold ">Entrega: </h5>'


                + '</div>'


                + '</div>'

                + '<div class="row my-3 py-2">'

                + '<div class="col-6" style="border-bottom: 2px solid ' + data_order.dentista_color + ';">'

                + '<h5 class=" fw-bold ">Registro Mordida:   <span style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + (data_order.regMor ? 'SI' : 'NO') + '</span></h5>'
                + '</div>'

                + '<div class="col-6" style="border-bottom: 2px solid ' + data_order.dentista_color + ';">'
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


                productos = productos + '<div  class=" my-3 text-center" style="border-top: 2px solid ' + data_order.dentista_color + ';">'
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

            let comentarios = '<div  class="my-2" style="border-bottom: 2px solid ' + data_order.dentista_color + ';"></div><h3 class="text-center my-2 fw-bold" >Comentarios:</h3>'
                + '<div style="border:solid;border-color:' + data_order.dentista_color + ';" class="text-center p-5">'
                + '<h5 class="p-0 m-0" style="color:' + data_order.dentista_color + ';">' + data_order.comentario.toUpperCase() + '</h5>'
                + '</div>'
                + '</div>'
                + '</div>'

            var ticketHTML = '<div class="card">'

                + '<div class="card-header">'
                + '<div class="row text-center">'

                + '</div>'
                + '</div>'

                + datos_generales
                + '<div class="my-4 py-2 text-center">'
                + productos
                + '</div>'

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

    $(".btn-check").click(function () {
        count_tooth()
    });

    let search = "";


})
;

