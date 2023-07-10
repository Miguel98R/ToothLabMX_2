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
    //////////////----------------------------------------------------------------------- TABLA HISTORIAL DE PAGOS ----------------------------------------------------------------------_///////

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


                let inputCantidad = '<div class="m-1"><input value="' + data + '" min=0 type="number" id_dentista="' + row.id_dentista + '"   id_pago="' + row.id_pago + '" class="total_pagos form-control w-100" > </div>'
                return inputCantidad
            }
        },
        {
            data: "id_pago",
            render: function (data, v, row) {


                return `<button class="deletePago btn btn-danger" id_dentista="${row.id_dentista}" id_pago="${data}">Eliminar</button>`

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

        order: [[0, 'asc']],

        pageLength: 10,

        columns: columnsPagos,


        paging: true,
        fixedHeader: true,
        bAutoWidth: false,
    });


    let drawPagos = function (id_dentista) {

        HoldOn.open(HoldOptions)
        api_conection('POST', 'api/dentist/pagosByDentist/' + id_dentista, {}, function (data) {
            HoldOn.close()
            let dataPagos = data.data

            console.log("dataPagos----------", dataPagos)

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

        api_conection('POST', 'api/dentist/addPagos', body, async function (response) {
            notyf.success(response.message)
            $('#aCuenta').val(0)
            await drawPagos(body.id_dentista )

            await sumTotales()

        })
    })

//// ---------------------------------------------------------------------  ELIMINAR PAGOS
    $(document.body).on('click', '.deletePago', function () {

        let id_pago = $(this).attr('id_pago')
        let id_dentista = $(this).attr('id_dentista')


        api_conection('DELETE', 'api/dentist/deletePago/' + id_pago, {}, async function (response) {
            notyf.success(response.message)

            await drawPagos(id_dentista)
            await drawOrders(id_dentista)
            await drawOrdersPagadas(id_dentista)
            await sumTotales()

        })
    })

////// ---------------------------------------------------------------------  EDITAR PAGOS
    $(document.body).on('change', '.total_pagos', function () {

        let body = {}

        let id_dentista = $(this).attr('id_dentista')

        body.id_pago = $(this).attr('id_pago')

        body.val = $(this).val()


        api_conection('PUT', 'api/dentist/editPago/', {body}, async function (response) {
            notyf.success(response.message)

            await drawPagos(id_dentista)
            await drawOrders(id_dentista)
            await drawOrdersPagadas(id_dentista)
            await sumTotales()

        })
    })


    //////////////------------------------------------------------------- TABLA ORDENES --------------------------------------------------------------------_///////

    //COLUMNAS DE LA DATATABLE ORDENES
    let columnsOrdenes = [
        {
            width: "5%",
            data: "folio",

        },
        {
            width: "5%",
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
        {
            width: "10%",
            data: "id_dentista",
            render: function (data, v, row) {

                let btnPagado = '<div class="m-1"><button pagado="true"   id_dentista="' + data + '"   id_order="' + row._id + '" class="changeStatus btn btn-success w-100">Orden pagada</button></div>'
                return btnPagado
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
        HoldOn.open(HoldOptions)
        api_conection('POST', 'api/orders/orderByDentist/' + id_dentista, {}, function (data) {
            HoldOn.close()

            let dataOrders = data.data


            if (dataOrders.length < 1) {
                $('#saldoDeuda').val(0)
                tblOrdenes.clear();
                tblOrdenes.rows.add(dataOrders).draw();
                sumTotales()
                notyf.open({type: "warning", message: "Este dentista no tiene ordenes"});
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


        api_conection('POST', 'api/orders/editTotalOrder', body, async function (response) {
            notyf.success(response.message)
            await drawPagos(id_dentista)
            await drawOrders(id_dentista)
            await drawOrdersPagadas(id_dentista)
            await sumTotales()

        })
    })


    //////////////------------------------------------------------------- TABLA ORDENES PAGADAS --------------------------------------------------------------------_///////


    //COLUMNAS DE LA DATATABLE ORDENES
    let columnsOrdenesPagadas = [
        {
            width: "5%",
            data: "folio",

        },
        {


            data: "fecha_pagada",
            render: function (data, v, row) {
                return '<p class="fw-bolder">' + moment(data).format('dddd DD MMMM YYYY') + '</p>'


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


                let total_order = row.total_order

                if (total_order == undefined) {
                    total_order = 0
                }

                let total = '<div class="m-1"><p >' + total_order + '</p> </div>'
                return total
            }
        },
        {
            width: "10%",
            data: "id_dentista",
            render: function (data, v, row) {

                let btnPagadoNo = '<div class="m-1"><button id_dentista="' + data + '" pagado="false"   id_order="' + row._id + '" class="changeStatus btn btn-warning w-100">Regresar a no pagada</button></div>'
                return btnPagadoNo
            }
        },

    ];

    //CONFIGURACION DE LA DATATABLE ORDENES
    let tblOrdenesPagadas = $("#tblOrdenesPagadas").DataTable({
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

        columns: columnsOrdenesPagadas,

        paging: true,
        fixedHeader: true,
        bAutoWidth: false,
    });


    let drawOrdersPagadas = function (id_dentista) {
        HoldOn.open(HoldOptions)

        api_conection('POST', 'api/orders/orderPagadasByDentist/' + id_dentista, {}, function (data) {
            HoldOn.close()

            let dataOrders = data.data

            console.log(dataOrders)
            if (dataOrders.length < 1) {
                notyf.open({type: "warning", message: "Este dentista no tiene ordenes pagadas"});
                tblOrdenesPagadas.clear();
                tblOrdenesPagadas.rows.add(dataOrders).draw()
                sumTotales()
                return
            }


            tblOrdenesPagadas.clear();
            tblOrdenesPagadas.rows.add(dataOrders).draw();

            sumTotales()
        })
    }


    $(document.body).on('click', '.changeStatus', function () {


        let id_order = $(this).attr('id_order')
        let id_dentista = $(this).attr('id_dentista')
        let pagado = $(this).attr('pagado')


        api_conection('PUT', 'api/orders/orderisPagada/' + id_order, {pagado}, async function (response) {
            notyf.success(response.message)

            await drawOrders(id_dentista)

            await drawPagos(id_dentista)



            await drawOrdersPagadas(id_dentista)


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

    $('.dentistas_name').change(async  function () {
        let nombre = $(this).val()
        let id_dentista = $("#dentista_option").find('option[value="' + nombre + '"]').attr('id_dentista');

       await drawPagos(id_dentista)
       await drawOrders(id_dentista)
       await drawOrdersPagadas(id_dentista)
        $('#nameDentista').text(nombre)


        $('#cantidadSaldo').val(0)
        $('#saldoPagos').val(0)
        $('#saldoDeuda').val(0)
    });


    drawOptionsDentist('');
})