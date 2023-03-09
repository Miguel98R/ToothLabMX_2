verificador();

$(document).ready(function () {
    let today = moment().format("DD-MM-YYYY");

    $(".date_entrada").datepicker({language: "es", format: "dd-mm-yyyy", startDate: 'd'}).val(today);

    $(".date_entrada").datepicker('setDate', today);

    $(".date_salida").datepicker({language: "es", format: "dd-mm-yyyy", startDate: 'd'});


    $(".saved_order").click(function () {
        let tooths = $(".btn-check");
        let dentist = $(".dentistas_name").val();
        let name_paciente = $(".paciente_name").val();
        let fecha_entrada = $(".date_entrada").val();
        let fecha_salida = $(".date_salida").val();
        let cantidad = $(".count_tooths").text();
        let producto_name = $(".producto_name").val();
        let color_name = $(".color_name").val();
        let comentario = $(".comntario_order").val();

        let tooths_array = [];
        let new_order = {};
        let new_order_details = {};

        if (dentist == "" || dentist == undefined) {
            notyf.open({type: "warning", message: "Seleccione el dentista"});
            return;
        }
        if(name_paciente == "" || name_paciente== undefined){
            notyf.open({type: "warning", message: "Ingresa el paciente"});
            return;
        }

        if (producto_name == "" || producto_name == undefined) {
            notyf.open({type: "warning", message: "Seleccione el producto"});
            return;
        }


        tooths.each((i, element) => {
            if ($(element).prop("checked") == true) {
                let value = $(element).val();
                tooths_array.push(value);
            }
        });

        new_order.name_paciente = name_paciente;
        new_order.dentista = dentist;
        new_order.fecha_entrante = fecha_entrada;
        new_order.fecha_saliente = fecha_salida;
        new_order.comentario = comentario;

        new_order_details.cantidad = cantidad;
        new_order_details.color = color_name;
        new_order_details.tooths = tooths_array;
        new_order_details.producto_name = producto_name;

        api_conection(
            "POST",
            "api/orders/new_order",
            {new_order, new_order_details},
            function (data) {
                let data_order = data.data;
                notyf.success("Orden  " + data_order.id_order + "  creada con exito");
                clean_input();
            }
        );
    });


    $(".btn-check").click(function () {
        count_tooth()
    });

    let drawLastOrder = function () {

        api_conection('GET', 'api/orders/last_order/', {}, function (data) {


            let order_data = data.data


            let status = asignament_status(order_data.status)

            $('.see_last_order').append('<div class="card text-start">'

                + '<div class="card_header bg-dark text-white text-center py-2">'
                + '<h5>Ultima orden creada</h5>'
                + '</div>'
                + '<div class="card_body p-2">'
                + '<div class="row">'
                + '<div class="col-6">'
                + '<p class="fw-bold">Folio: <mark class="fw-normal"> ' + order_data.id_order + '</mark></p>'
                + '<p class="fw-bold">Fecha Entrada: <mark class="fw-normal"> ' + moment(order_data.fecha_entrante, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</mark></p>'
                + '<p class="fw-bold">Fecha Salida: <mark class="fw-normal"> ' + moment(order_data.fecha_saliente, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</mark></p>'
                + '</div>'
                + '<div class="col-6">'
                + '<p class="fw-bold">Dentista: <mark class="fw-normal" style="color:' + order_data.dentista.distintivo_color + ';"> ' + order_data.dentista.name_dentista + '</mark></p>'
                + '<p class="fw-bold">Paciente: <mark class="fw-normal"> ' + order_data.name_paciente + '</mark></p>'
                + '<p class="fw-bold">Status: <mark class="fw-normal"> ' + status + '</mark></p>'

                + '</div>'
                + '</div>'

                + '</div>'
                + '<div class="card_footer text-center py-2">'
                + '<button id_order="' + order_data._id + '" class="btn btn-info see_details mx-2 "> Ver Orden</button>'
                + '<button status="' + order_data.status + '" id_order="' + order_data._id + '" class="mx-2 btn btn-secondary search_order "> Encontrar Orden</button>'
                + '</div>'
                + '</div>')


        },function (response) {



        })

    }



    let search = "";
    drawOptionsDentist(search);
    drawOptionsProducto(search);
    drawOptionsColor(search);
    drawLastOrder()
});
