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
    let dt_draw = function (search) {
        HoldOn.open(HoldOptions)
        api_conection("POST", apiUrl + "/dt_historic", {search}, function (data) {
            HoldOn.close()
            let data_historic = data.data;

            dt.clear();
            dt.rows.add(data_historic).draw();
        });
    };

    dt_draw('');


    //IMPRIMIR ORDEN

    $(document.body).on('click', '.imprimir_order', function () {
        let id_orden = $(this).attr('id_order')

        createTicket(id_orden)

    })

    $(".btn-check").click(function () {
        count_tooth()
    });


    $("#searchBtn").click(function () {
        let search = $("#searchinput").val()
        dt_draw(search);
    });

    $("#reiniciar").click(function () {
        $("#searchinput").val('')
        $("#searchPaciente").val('')
        $("#checkPaciente").prop('checked', false)
        $("#inputPacientes").css('display', 'none')
        dt_draw('');
    });

    $("#checkPaciente").change(function () {
        let check = $(this).prop('checked')
        if (check) {
            $("#inputPacientes").css('display', 'block')
        } else {
            $("#inputPacientes").css('display', 'none')
        }

    });

    $("#searchBtnPaciente").click(function () {
        let search = {}
        search.dentista = $("#searchinput").val()
        search.paciente = $("#searchPaciente").val()

        dt_draw(search);
    });


})
;

