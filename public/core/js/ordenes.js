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



    let search = "";
    drawOptionsDentist(search);
    drawOptionsProducto(search);
    drawOptionsColor(search);
});
