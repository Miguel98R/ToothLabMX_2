let TOKEN_ = false
let DATA_ = false

moment.locale('es');
/**
 * Spanish translation for bootstrap-datepicker
 * Bruno Bonamin <bruno.bonamin@gmail.com>
 */
;(function ($) {
    $.fn.datepicker.dates['es'] = {
        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: "Hoy",
        monthsTitle: "Meses",
        clear: "Borrar",
        weekStart: 0,
        format: "dd/mm/yyyy"
    };
}(jQuery));


const notyf = new Notyf({
    duration: 1000,
    position: {
        x: 'right',
        y: 'top',
    },
    types: [
        {
            type: 'warning',
            background: 'orange',
            icon: '<i class="fas fa-exclamation"></i>',
            duration: 2000,
            dismissible: true
        },
        {
            type: 'error',
            background: 'indianred',
            duration: 2000,
            dismissible: true
        },
        {
            type: 'success',
            background: 'green',
            duration: 2000,
            dismissible: true
        }
    ]
});


let verificador = function () {

    if (localStorage.getItem('TOKEN')) {
        TOKEN_ = localStorage.getItem('TOKEN')
    }

    api_conection('POST', 'api/auth/verify', undefined, function (response) {
        if (response.success) {
            DATA_ = response.data
        }
    }, function (e) {
        location.href = '/'
        localStorage.removeItem('TOKEN');

    })


}


let api_conection = async function (method, url, data, f_, error_) {
    try {
        let response
        if (method == "GET") {
            response = await fetch(url,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + localStorage.getItem('TOKEN') || false

                    },
                    method: method,
                })
        } else {
            response = await fetch(url,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + localStorage.getItem('TOKEN') || false

                    },
                    method: method,
                    body: data ? JSON.stringify(data) : ""
                })
        }

        response = await response.json();


        if (response.success == true) {
            if (f_) {
                f_(response);
            }
        } else {
            if (error_) {
                notyf.error(response.message)

                error_(response)
            }
        }
    } catch (e) {
        console.error(e);
        notyf.error('Ocurrio un error verifique sus datos e intentelo nuevamente', e)
        return 0
    }
}

let dt_draw = function (data_table) {

    api_conection("GET", "api/orders/data_dataTables/" + STATUS_BUSQUEDA, {}, function (data) {
        data_query = data.data;


        data_table.clear();
        data_table.rows.add(data_query).draw();
    });
};

let asignament_status = function (status_order) {

    let status = ''

    switch (status_order) {
        case 1:
            status = '<span class="text-primary fw-bold">Entrante</span>'
            break;
        case 2:
            status = '<span class="text-warning fw-bold">Prueba</span>'
            break;
        case 3:
            status = '<span class="text-secondary fw-bold">Regresado</span>'
            break;
        case 4:
            status = '<span class="text-success fw-bold">Terminado</span>'
            break;
        case 5:
            status = '<span class="text-info fw-bold">Cambios</span>'
            break;
        case 6:
            status = '<span class="text-danger fw-bold">Cancelado con costo</span>'
            break;
        case 7:
            status = '<span class="text-danger fw-bold">Cancelado</span>'
            break;

        default:
            status = '<span class="text-danger">Error al cargar el status<span>'
            break;
    }


    return status
}

let draw_modal_details = function (id) {
    $('.details_general_order').html('')

    $('.details_product_order').html('')


    api_conection("POST", "api/orders/details_order/" + id, {}, function (data) {
        let data_order = data.data;


        let button_delete = ''

        let status = asignament_status(data_order.status)
        $('.details_general_order').append('<div>'

            + '<div class="row">'

            + '<div class="col-4">'
            + '<p class="fw-bold">Folio: <span class="fw-normal"> ' + data_order.id_order + '</span></p>'
            + '<p class="fw-bold">  Fecha de entrada:  <span class="fw-normal">' + moment(data_order.fecha_entrante, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</span></p>'
            + '<p class="fw-bold"> Fecha salida:  <span class="fw-normal">' + moment(data_order.fecha_saliente, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</span></p>'


            + '</div>'
            + '<div class="col-4">'
            + '<p class="fw-bold">  Dentista: <span class="fw-normal">' + data_order.name_dentista + '</span></p>'
            + '<p class="fw-bold">  Paciente: <span class="fw-normal">' + data_order.name_paciente + '</span></p>'
            + '<p class="fw-bold">  Status: <span class="fw-normal">' + status + '</span></p>'
            + '</div>'

            + '<div class="col-4">'
            + '<p class="fw-bold">  Registro Mordida: <span class="fw-normal">' + (data_order.regMor ? 'SI' : 'NO') + '</span></p>'
            + '<p class="fw-bold">  Antagonista: <span class="fw-normal">' + ( data_order.antagon ? 'SI' : 'NO') + '</span></p>'
            + '<p class="fw-bold">  Comentarios: </p>'

            + '<textarea id_orden="' + data_order._id + '" class="fw-bold comentarios_details"> ' + data_order.comentario + '</textarea>'

            + '</div>'

            + '</div>'

            + '</div>')


        for (let item of data_order.products) {

            if (data_order.status == 6 || data_order.status == 7 || data_order.status == 4) {
                button_delete = ''
            } else {
                button_delete = '<button id_orden="' + data_order._id + '" id_detalle="' + item.id_detalle + '" class="btn btn-danger  delete_product btn_delete_' + item.id_detalle + '"><i class="fas fa-trash-alt"></i></button>'
            }


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


            $('.details_product_order').append('<div class="col-4 my-2">'
                + '<div class="card">'
                + '<div class="card-header bg-dark text-white"> '
                + '<div class="row ">'
                + '<div class="col-8">'
                + '<h6 class="fw-bold m-0 p-0 ">' + item.name_producto + '</h6>'
                + '</div>'
                + '<div class="col-4 text-end">'
                + button_delete
                + '</div>'
                + '</div>'
                + '</div>'
                + '<div class="card-body text-center"> '
                + '<small class="fw-bold">OD</small>'
                + '<p>--------------------------</p>'
                + tooths_10_20
                + '<br>'
                + tooths_30_40
                + '<p>--------------------------</p>'
                + '</div>'
                + '<div class="card-footer"> '

                + '<div class="row text-center">'
                + '<div class="col-6">'
                + '<small class="fw-bold">CANTIDAD</small>'
                + '<p class="fw-normal">' + item.cantidad + '</p>'
                + '</div>'
                + '<div class="col-6">'
                + '<small class="fw-bold">COLOR</small>'
                + '<p class="fw-normal">' + item.color + '</p>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'

                + '</div>')


        }


    });

}

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

let clean_input = function () {
    $(".btn-check").prop("checked", false);
    $(".dentistas_name").val('');
    $(".paciente_name").val('');
    $(".date_salida").val('');
    $("#count_tooths").text(0);
    $(".count_tooths").text(0);
    $(".producto_name").val('');
    $(".color_name").val('');
    $(".comntario_order").val('');
    $("#producto_nameEdit").val('');
    $("#color_nameEdit").val('');
    $("#addToothsModal").text(0);


};

let count_tooth = function (typeBtn) {

    let tooths = $(".btn-check");

    let contador_tooths = 0;

    tooths.each((i, element) => {
        if ($(element).prop("checked") == true) {
            contador_tooths++;
        }
    });

    if (typeBtn == "edit") {
        $("#countEdit").text(contador_tooths);

    }

    if (typeBtn == "order") {
        $("#ToothsOrder").text(contador_tooths);

    }

    if (typeBtn == "add") {

        $("#addToothsModal").text(contador_tooths);

    }


}

let drawOptionsDentist = function (search) {
    api_conection(
        "POST",
        "api/dentist/search_dentist",
        {search},
        function (data) {
            let dentist_list = data.data;
            for (let item of dentist_list) {
                $("#dentista_option").append(
                    '<option id_dentista="' +
                    item._id +
                    '" value="' +
                    item.name_dentista +
                    '">' +
                    item.name_dentista +
                    "</option>"
                );
            }
        }
    );
};

let drawOptionsProducto = function (search) {
    api_conection(
        "POST",
        "api/products/search_product",
        {search},
        function (data) {
            let products_list = data.data;
            for (let item of products_list) {
                $("#producto_option").append(
                    '<option id_product="' +
                    item._id +
                    '" value="' +
                    item.name_producto +
                    '">' +
                    item.name_producto +
                    "</option>"
                );
            }
        }
    );
};

let drawOptionsColor = function (search) {
    api_conection(
        "POST",
        "api/products/search_color",
        {search},
        function (data) {
            let colors_list = data.data;
            for (let item of colors_list) {
                $("#color_option").append(
                    '<option id_product="' +
                    item._id +
                    '" value="' +
                    item.name_color +
                    '">' +
                    item.name_color +
                    "</option>"
                );
            }
        }
    );
};

let drawLastOrder = function (search) {
    $('#productos').html('')

    api_conection('POST', 'api/orders/last_order/', {search}, function (data) {




        let order_data = data.data

        console.log(order_data,"<------data")
        console.log(order_data.length,"<------data length")


        if (order_data.length < 1) {
            $('#dataLastOrder').hide()
            $('#NoDataLastOrder').show()

        }else{
            $('#dataLastOrder').show()
            $('#NoDataLastOrder').hide()
            for (let item of order_data) {
                console.log("itme 2---------z",item)

                if(item.regMor){
                    $('#regMorLast').prop("checked",true)
                }else{
                    $('#regMorLast').prop("checked",false)

                }

                if(item.antagon){
                    $('#antagonLast').prop("checked",true)
                }else{
                    $('#antagonLast').prop("checked",false)

                }



                $('#dentistaOrder').val(item.dentista)
                $('#Folio').text(item.folio)
                $('#pacienteOrder').val(item.paciente)
                $('#fechaEntranteLast').val(item.fecha_entrante)


                $('#fechaSalienteLast').val(item.fecha_saliente)


                $('#comentLast').val(item.comentario)
                $('#statusLast').val(item.status)

                $('#statusLast').attr('id_orden', item._id)
                $('#statusLast').attr('status_actual', item.status)

                $('#gridProductos').html('')

                $('.editDataOrder').attr('id_orden', item._id)
                $('.add_products').attr('id_order', item._id)
                $('#imprimirOrder').attr('id_order', item._id)

                $('#statusLast').attr('folio', item.folio)

                $('.editDataOrder').attr('folio', item.folio)
                $('.add_products').attr('folio', item.folio)


                for (let jtem of item.detalle) {

                    let button_delete
                    let button_edit

                    if (item.status == 6 || item.status == 7 || item.status == 4) {
                        button_delete = ''
                        button_edit = ''


                    } else {
                        button_delete = '<button id_orden="' + item._id + '" id_detalle="' + jtem.detalle._id + '" class=" my-1 btn btn-block btn-danger  delete_product btn_delete_' + jtem.detalle._id + '"><i class="fas fa-trash-alt"></i></button>'
                        button_edit = '<button colorEdit="' + jtem.detalle.color + '" productoEdit="' + jtem.detalle.producto.name_producto + '" dientesEdit="' + jtem.detalle.tooths + '" id_orden="' + item._id + '" id_detalle="' + jtem.detalle._id + '" class=" my-1 btn btn-warning  btn-block  edit_product btn_edit_' + jtem.detalle._id + '"><i class="fas fa-edit fa-rotate-270 fa-sm"></i></button>'
                    }

                    let tooths_10_20 = ''
                    let tooths_30_40 = ''

                    for (let od of jtem.detalle.tooths) {

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


                    var row = '<table class="display text-center table table-hover"><tr>' +
                        '<td>' + jtem.detalle.producto.name_producto + '</td>' +
                        '<td>' + jtem.detalle.cantidad + '</td>' +
                        '<td><p>'+ tooths_10_20 + '</p><p>'+ tooths_30_40+ '</p></td>' +
                        '<td>' + jtem.detalle.color + '</td>' +
                        '<td>' + button_delete + button_edit + '</td></tr></table>'


                    $('#productos').append(row  +'<div class="bg-dark py-1"></div>')


                }


            }
        }




    }, )

}

let add_product = function (id_orden,folio) {

    let tooths = $(".btn-check");
    let producto_name = $("#addProductModal").val();
    let color_name = $("#addColorModal").val();
    let cantidad = $("#addToothsModal").text();
    let tooths_array = [];
    let new_product = {};

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

    new_product.cantidad = cantidad;
    new_product.color = color_name;
    new_product.tooths = tooths_array;
    new_product.producto_name = producto_name;

    api_conection(
        "POST",
        "api/orders/add_product/" + id_orden,
        {new_product},
        function (response) {
            notyf.success(response.message);
            clean_input();
            $('#agregar_productModal').modal('hide')
            drawLastOrder(folio)
        }
    );
}

$(document).ready(function () {

    $(document.body).on('click', '.out_session', function () {

        location.href = '/'
        localStorage.removeItem('TOKEN');

    })

})
