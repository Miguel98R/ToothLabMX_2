$(function () {

    let lenguajeDT = {
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
    }

    let sumTotales = function () {
        let total_pagos = $("#saldoPagos").val()
        let total_orders = $('#saldoDeuda').val()

        let total_adeudo = 0


        total_adeudo = Number(total_pagos) - Number(total_orders)

        $('#cantidadSaldo').text('')

        $('#cantidadSaldo').text(total_adeudo)
        drawColorSaldo(total_adeudo)

    }
    ///////////////////---------------HISTORIAL DE PAGOS -----------------_///////

    //COLUMNAS DE LA DATATABLE PAGOS
    let columnsPagos = [
        {


            data: "fecha_pago",
            render: function (data, v, row) {
                return '<p class="fw-bolder">' + moment(data).format('dddd DD MMMM YYYY') + '</p>'


            }

        },

        {

            data: "cantidad",
            render: function (data, v, row) {


                let inputCantidad = '<div class="m-1"><input value="' + data + '" min=0 type="number" id_order="' + row._id + '" class="total_pagos form-control w-100" disabled></div>'
                return inputCantidad
            }
        },
        {
            data:"id_pago",
            render: function (data, v, row) {


                return `<button class="deletePago btn btn-danger" id_pago="${data}">Eliminar</button>`

            }
        }


    ];

    //CONFIGURACION DE LA DATATABLE PAGOS
    let tblPago = $("#tbl_Pagos").DataTable({
        language: lenguajeDT,
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
            [3, 5, 10, 25, 50, 100, 1000],
            ["3", "5", "10", "25", "50", "100", "1000"],
        ],

        order: [[0, 'desc']],

        pageLength: 3,

        columns: columnsPagos,


        paging: true,
        fixedHeader: true,
        bAutoWidth: false,
    });


    let drawPagos = function (id_dentista) {

        api_conection('POST', 'api/dentist/pagosByDentist/' + id_dentista, {}, function (data) {
            let dataPagos = data.data


            tblPago.clear();
            tblPago.rows.add(dataPagos).draw();

            let suma_pagos = 0

            for (let item of dataPagos) {
                suma_pagos = suma_pagos + Number(item.cantidad)
            }
            $('#saldoPagos').val(suma_pagos)

            sumTotales()
        })
    }

    $('#aCuenta').change(function () {
        let body = {}
        body.id_dentista = $(this).attr('id_dentista')
        body.value = $(this).val()

        api_conection('POST', 'api/dentist/addPagos', body, function (response) {
            notyf.success(response.message)
            $('#aCuenta').val(0)
            drawPagos(body.id_dentista)

        })
    })

    ///////////////////---------------ORDENES--------------------_///////

    //COLUMNAS DE LA DATATABLE ORDENES
    let columnsOrdenes = [
        {
            width: "5%",
            data: "folio",

        },
        {
            width: "15%",
            data: "paciente",
            render: function (data, v, row) {
                return data.toUpperCase()
            }
        },


        {
            width: "5%",
            data: "detalle",
            render: function (data, v, row) {

                let tamano = data[0].detalle.tooths;


                return tamano.length

            }

        },
        {
            width: "20%",
            data: "detalle",
            render: function (data, v, row) {


                return data[0].detalle.producto.name_producto;

            }

        },
        {
            width: "20%",
            data: "detalle",
            render: function (data, v, row) {

                let tamano = data[0].detalle.tooths;
                let tooths_10_20 = ''
                let tooths_30_40 = ''


                for (let od of tamano) {

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


                return '<center  >' + tooths_10_20 + '<br>' + tooths_30_40 + '</center>'

            }

        },


        {
            width: "5%",
            data: "status",
            render: function (data, v, row) {
                let status_text = asignament_status(data)
                return '<h5>' + status_text + '</h5>'
            }
        },
        {
            width: "10%",
            data: "id_dentista",
            render: function (data, v, row) {

                $('#aCuenta').attr('id_dentista', data)

                let total_order = row.total_order

                if (total_order == undefined) {
                    total_order = 0
                }

                let inputAcuenta = '<div class="m-1"><input id_dentista="' + data + '" value="' + total_order + '" min=0 type="number" id_order="' + row._id + '" class="total_orders form-control w-100"></div>'
                return inputAcuenta
            }
        },

    ];

    //CONFIGURACION DE LA DATATABLE ORDENES
    let tblOrdenes = $("#tblOrdenes").DataTable({
        language: lenguajeDT,
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

        columns: columnsOrdenes,

        paging: true,
        fixedHeader: true,
        bAutoWidth: false,
    });


    let drawOrders = function (id_dentista) {

        api_conection('POST', 'api/orders/orderByDentist/' + id_dentista, {}, function (data) {
            let dataOrders = data.data

            console.log(dataOrders)
            if (dataOrders.length < 1) {
                notyf.open({type: "warning", message: "Este dentista no tiene ordenes"});
                tblOrdenes.clear();
                tblOrdenes.rows.add(dataOrders).draw();
                return
            }


            tblOrdenes.clear();
            tblOrdenes.rows.add(dataOrders).draw();

            let suma_deuda = 0

            for (let item of dataOrders) {
                suma_deuda = suma_deuda + Number(item.total_order)
            }
            $('#saldoDeuda').val(suma_deuda)


            sumTotales()
        })
    }

    $(document.body).on('change', '.total_orders', function () {

        let body = {}

        body.value = $(this).val()
        body.id_order = $(this).attr('id_order')
        let id_dentista = $(this).attr('id_dentista')


        api_conection('POST', 'api/orders/editTotalOrder', body, function (response) {
            notyf.success(response.message)
            drawOrders(id_dentista)
            sumTotales()

        })
    })


    let drawColorSaldo = function (saldo) {
        if (saldo < 0) {
            $('#cantidadSaldo').addClass('text-danger')
            $('#cantidadSaldo').removeClass('text-success')
        } else {
            $('#cantidadSaldo').addClass('text-success')
            $('#cantidadSaldo').removeClass('text-danger')


        }
    }

    $('.dentistas_name').change(function () {
        let nombre = $(this).val()
        let id_dentista = $("#dentista_option").find('option[value="' + nombre + '"]').attr('id_dentista');

        drawPagos(id_dentista)
        drawOrders(id_dentista)
        $('#nameDentista').text(nombre)


        $('#cantidadSaldo').val(0)
        $('#saldoPagos').val(0)
        $('#saldoDeuda').val(0)
    });


    drawOptionsDentist('');
})