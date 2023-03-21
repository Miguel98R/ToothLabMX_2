verificador();

$(document).ready(function () {
    let columns = [
        {
            width: "20%",
            data: "name_dentista",
        },
        {
            width: "15%",
            data: "tel_dentista",
            render: function (data, v, row) {
                if (data == "") {
                    return '<p class="text-danger">No se registro un celular personal</p>';
                } else {
                    return data;
                }
            },
        },

        {
            width: "15%",
            data: "distintivo_color",
            render: function (data, v, row) {
                return (
                    '<div class="py-3  mx-3" style="background-color:' +
                    data +
                    ';"></div>'
                );
            },
        },

        {
            width: "8%",
            data: "cont_ordenes",
            render: function (data, v, row) {
                return '<p class="fw-bold">' + data + '</p>';


            },
        },
        {
            width: "8%",
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
            width: "20%",
            data: "_id",
            render: function (data, v, row) {
                if (row.status) {
                    return (
                        '<button id_dentista="' +
                        data +
                        '" class="btn btn-primary btn-block see_details my-2 mx-2 ">Ver datos</button>' +
                        '<button status="true" id_dentista="' +
                        data +
                        '" class="btn btn-danger btn-block change_status my-2 mx-2 ">Inabilitar</button>'
                    );
                } else {
                    return (
                        '<button id_dentista="' +
                        data +
                        '" class="btn btn-primary btn-block see_details my-2 mx-2 ">Ver datos</button>' +
                        '<button  status="false" id_dentista="' +
                        data +
                        '" class="btn btn-success btn-block change_status my-2 mx-2 ">Habilitar</button>'
                    );
                }
            },
        },
    ];

    dt = $("#tbl_dentistas").DataTable({
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

    let data_dentista;

    //DATA PARA PINTAR DATATABLES

    let dt_draw = function () {
        api_conection("GET", "api/dentist/data_dataTables", {}, function (data) {
            data_dentista = data.data;

            dt.clear();
            dt.rows.add(data_dentista).draw();
        });
    };

    dt_draw();

    //abrir modal para crear dentistas
    $(".open_modal_new_dentist").click(function () {

        $("#name_dentist").val("");
        $("#direccion_dentist").val("");
        $("#tel_dentista").val("");
        $("#tel_consultorio").val("");
        $("#distintivo_dentista").val("");
        $("#email_dentist").val("");

        $("#new_dentista_modal").modal("show");
    });

    //creacion de nuevo dentista

    let new_dentist;

    $('.new_dentist').click(function () {
        let nombre = $("#name_dentist").val();
        let direccion = $("#direccion_dentist").val();
        let cel_dentista = $("#tel_dentista").val();
        let cel_consultorio = $("#tel_consultorio").val();
        let distintivo_color = $("#distintivo_dentista").val();
        let email = $("#email_dentist").val();

        if (nombre == "" || nombre == undefined) {
            notyf.error("ingresa el nombre");
            return 0;
        }

        if (distintivo_color == "" || distintivo_color == undefined) {
            notyf.error("ingresa el distintivo");
            return 0;
        }

        nuevo_dentista = {
            name_dentista: nombre,
            domicilio_dentista: direccion,
            tel_dentista: cel_dentista,
            tel_consultorio: cel_consultorio,
            distintivo_color: distintivo_color,
            email_dentista: email,
        };

        api_conection(
            "POST",
            "api/dentist/new_dentist",
            nuevo_dentista,
            function (data) {
                notyf.success("Dentista creado !");
                dt_draw();
            },
            function (message) {

            }
        );
    });

    // VER DATOS PERSONALES DEL DENTISTA

    $(document.body).on("click", ".see_details", function () {
        let id = $(this).attr("id_dentista");
        modal_details(id);
    });

    let modal_details = function (id) {
        $("#detailsDentist_modal").modal("show");

        api_conection(
            "POST",
            "api/dentist/details_dentist/" + id,
            {},
            function (data) {
                let data_dentista = data.data;

                $("#nombre_dentista").val(data_dentista.name_dentista);
                $("#direccion_dentista").val(data_dentista.domicilio_dentista);
                $("#email_dentista").val(data_dentista.email_dentista);
                $("#cel_dentista").val(data_dentista.tel_dentista);
                $("#cel_consultorio").val(data_dentista.tel_consultorio);
                $("#Color_dentista").val(data_dentista.distintivo_color);

                $(".save_edit").attr("id_dentista", data_dentista._id);
            }
        );
    };

    // CAMBIAR STATUS DENTISTA

    $(document.body).on("click", ".change_status", function () {
        let id = $(this).attr("id_dentista");
        let status = $(this).attr("status");

        api_conection(
            "PUT",
            "api/dentist/change_Status/" + id,
            {status},
            function () {
                notyf.success("Status actualizado !");

                dt_draw();
            }
        );
    });

    //GUARDAR NUEVOS DATOS
    $(".save_edit").click(function () {
        let data_user = {};
        let id = $(this).attr("id_dentista");
        let nombre = $("#nombre_dentista").val();
        let direccion = $("#direccion_dentista").val();
        let email = $("#email_dentista").val();
        let cel_den = $("#cel_dentista").val();
        let cel_cons = $("#cel_consultorio").val();
        let color = $("#Color_dentista").val();

        if (nombre == undefined || nombre == "") {
            notyf.error("No puedes guardar al  dentista sin su nombre !");

            return;
        }

        if (color == undefined || color == "") {
            notyf.error("No puedes guardar al dentista sin su distintivo!");

            return;
        }

        data_user.name_dentista = nombre;
        data_user.domicilio_dentista = direccion;
        data_user.email_dentista = email;
        data_user.tel_dentista = cel_den;
        data_user.tel_consultorio = cel_cons;
        data_user.distintivo_color = color;

        api_conection(
            "PUT",
            "api/dentist/update_dentista/" + id,
            {data_user},
            function () {
                notyf.success("Datos actualizados!");

                modal_details(id);
                dt_draw();
            }
        );
    });
});
