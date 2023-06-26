verificador();

$(function () {

    let apiUrl = "api/colores"
    let
        columns = [
            {
                width: "50%",
                data: "name_color",
                render: function (data, v, row) {
                    let input = `<input id_color="${row._id}" value="${data}" class="edit_color  w-100 ">`

                    return input
                },
            },

            {
                width: "50%",
                data: "_id",
                render: function (data, v, row) {
                    let btn_eliminar = `<button id_color="${data}" class="delete_color btn btn-danger w-100 ">Eliminar</button><br>`

                    return btn_eliminar
                },
            },
        ];

    let dt = $("#tbl_colores").DataTable({
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

        order: [[1, "desc"]],

        pageLength: 5,

        columns: columns,

        scrollY: 470,
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        fixedHeader: true,
    });


    //DATA PARA PINTAR DATATABLES

    let dt_draw = function () {
        api_conection("POST", apiUrl + "/dt_colores", {}, function (data) {
            let data_colores = data.data;
            dt.clear();
            dt.rows.add(data_colores).draw();
        });
    };

    dt_draw();

    //abrir modal para crear color
    $("#open_newColor").click(function () {

        $("#name_color").val("");
        $("#new_color").modal("show");

    });

    //creacion de nuevo color

    $('#btnNew_color').click(function () {


        let new_colors = $("#name_color").val();

        if (new_colors == "" || new_colors == undefined) {
            notyf.error("ingresa el nombre");
            return 0;
        }


        api_conection("POST", apiUrl + "/new_color", {new_colors}, function (response) {
                notyf.success(response.message);
                dt_draw();
                $('#new_color').modal('hide')
            },
            function (message) {

            }
        );
    });

    //ELIMINAR COLOR

    $(document.body).on('click', '.delete_color', function () {

        let id_color = $(this).attr('id_color');

        Swal.fire({
            title: "¿ Seguro que quiere eliminar este color ?  ",
            text: "Esta acción no tiene retorno",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#006f2c",
            cancelButtonColor: "#e80303",
            confirmButtonText: "Si Adelante!",
            cancelButtonText: "Cancelar",
        }).then((confirmacionTrue) => {

            if (confirmacionTrue.value) {
                api_conection("DELETE", apiUrl + "/delete_color/" + id_color, {}, function (response) {
                        notyf.success(response.message);
                        dt_draw();

                    },
                    function (message) {
                        notyf.error(message);
                    }
                );
            }
        })


    });

    //EDITAR COLOR

    $(document.body).on('change', '.edit_color', function () {

        let id_color = $(this).attr('id_color');
        let name_color = $(this).val()
        Swal.fire({
            title: "¿ Seguro que quiere editar este  color ?  ",

            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#006f2c",
            cancelButtonColor: "#e80303",
            confirmButtonText: "Si Adelante!",
            cancelButtonText: "Cancelar",
        }).then((confirmacionTrue) => {

            if (confirmacionTrue.value) {
                api_conection("PUT", apiUrl + "/edit_color/" + id_color, {name_color}, function (response) {
                        notyf.success(response.message);
                        dt_draw();

                    },
                    function (message) {
                        notyf.error(message);
                    }
                );
            }
        })


    });

});
