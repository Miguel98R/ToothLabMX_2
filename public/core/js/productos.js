verificador();

$(document).ready(function () {
    let columns = [
        {

            data: "name_producto",
        },
        {

            data: "precio",
            render: function (data, v, row) {
                return ' <p><span>$ </span>' + data + '</p>'
            }
        },
        {

            data: "status",
            render: function (data, v, row) {
                if (data == true) {
                    return '<p class="text-success">Activo</p>';
                } else {
                    return '<p class="text-danger">Inactivo</p>';
                }
            },
        },
        {

            data: "cuenta_uso",
        },

        {

            data: "_id",
            render: function (data, v, row) {

                let btnEditar = '<button id_product="' + data + '" class="editarOpen btn btn-warning btn-block">Editar</button>'

                if (row.status) {
                    return btnEditar + '<button status="true" id_product="' +
                        data +
                        '" class="btn btn-danger btn-block change_status ">Inabilitar</button>'

                } else {
                    return btnEditar + '<button  status="false" id_product="' + data +
                        '" class="btn btn-block btn-success btn-sm change_status ">Habilitar</button>'

                }
            },
        },
    ];

    dt = $("#tbl_productos").DataTable({
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

        order: [[3, "desc"]],

        pageLength: 5,

        columns: columns,

        scrollY: 470,
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        fixedHeader: true,
    });

    let data_producto;

    //DATA PARA PINTAR DATATABLES

    let dt_draw = function () {

        api_conection("GET", "api/products/data_dataTables", {}, function (data) {


            data_producto = data.data;

            dt.clear();
            dt.rows.add(data_producto).draw();
        });
    };

    dt_draw();

    //ABRIR MODAL PARA CREAR NUEVO PRODUCTO
    $(".open_modal_new_producto").click(function () {
        $("#name_product").val("");
        $("#precio_producto").val("");

        $("#new_product_modal").modal("show");
    });

//CREACION DE NUEVO PRODUCTO


    $('.new_product').click(function () {
        let nombre = $("#name_product").val();

        let precio = $("#precio_producto").val();

        if (nombre == "" || nombre == undefined) {
            notyf.error("ingresa el nombre del producto");
            return 0;
        }

        if (precio == "" || precio == undefined) {
            notyf.error("ingresa el precio del producto");
            return 0;
        }

        nuevo_producto = {
            name_producto: nombre,
            precio: precio,
        };

        api_conection(
            "POST",
            "api/products/new_product",
            nuevo_producto,
            function (data) {
                notyf.success("Producto creado !");
                dt_draw();
                $('#new_product_modal').modal('hide')
            }
        );
    });

//Actualizar precio del producto
    $(document.body).on("change", ".change_precio", function () {

        let id_producto = $(this).attr("id_producto")
        let precio = $('.precio_product_' + id_producto).val()

        api_conection("PUT", "api/products/precios_product/" + id_producto, {precio}, function () {

            notyf.success("Precio actualizado !");

            dt_draw();

        })

    })


    // CAMBIAR STATUS

    $(document.body).on("click", ".change_status", function () {
        let _id = $(this).attr("id_product");
        let status = $(this).attr("status");

        api_conection(
            "PUT",
            "api/products/change_Status/" + _id,
            {status},
            function () {
                notyf.success("Status actualizado !");

                dt_draw();
            }
        );
    });


//EDITAR PRODUCTO

    $(document.body).on('click', '.editarOpen', function () {
        let id_product = $(this).attr('id_product')

        $('#editProductModal').modal('show')
        drawDataProduct(id_product)
    })


    $('#saveEditProduct').click(function () {
        let id_product = $(this).attr('id_product')
        let body = {}


        body.name_producto = $('#nameProduct').val()
        body.precio = $('#priceProduct').val()

        api_conection(
            "PUT",
            "api/products/edit_product/" + id_product,
            body,
            function (response) {

                notyf.success(response.message);

                dt_draw();

            }
        );

    })
    let drawDataProduct = function (id_product) {
        api_conection(
            "POST",
            "api/products/productById/" + id_product,
            {},
            function (data) {

                let dataProduct = data.data

                $('#nameProduct').val(dataProduct.name_producto)
                $('#priceProduct').val(dataProduct.precio)
                $('#saveEditProduct').attr('id_product', dataProduct._id)


            }
        );
    }


});
