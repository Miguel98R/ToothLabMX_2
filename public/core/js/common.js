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

HoldOptions = {
    theme: "sk-circle",
    message: 'Espere... ',
    textColor: "#000000",
    backgroundColor: "#FFFFFF",
}

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
    HoldOn.open(HoldOptions)
    api_conection("GET", "api/orders/data_dataTables/" + STATUS_BUSQUEDA, {}, function (data) {
        HoldOn.close()
        let data_query = data.data;


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
            + '<p class="fw-bold">  Antagonista: <span class="fw-normal">' + (data_order.antagon ? 'SI' : 'NO') + '</span></p>'
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
    let content_finished = headerHTML + htmlCreado + footerHTML;

    var WinPrint = window.open('', '', 'width=630,height=560,scrollbars=1,menuBar=1');
    WinPrint.document.write(content_finished);
    WinPrint.document.close();

    // Agrega un listener para el evento beforeprint
    WinPrint.addEventListener('beforeprint', () => {
        // Acciones antes de imprimir
        console.log('Before Print');
    });

    // Agrega un listener para el evento afterprint
    WinPrint.addEventListener('afterprint', () => {
        // Acciones después de imprimir
        console.log('After Print');

        // Cierra la ventana después de imprimir
        WinPrint.close();
    });

    // Agrega un listener para el evento onunload
    WinPrint.onunload = WinPrint.onbeforeunload = function () {
        // Acciones antes de cerrar la ventana
        console.log('Window Unload or BeforeUnload');
    };

    try {
        // Inicia la impresión
        WinPrint.print();
    } catch (error) {
        console.error('Error during printing:', error);
    }
};




let createTicket = function(id_orden){

    let logo = '../public/img/logo.jpg'

    api_conection("POST", "api/orders/details_order/" + id_orden, {}, function (data) {


        let data_order = data.data

        let status = asignament_status(data_order.status)

        let datos_generales = '<div class=" card-body text-start ">'


            + '<div class="row ">'
            + '<div class="col-12" >'

            + '<div class="row my-2">'
            + '<div class="col-6" >'
            + '<h4  style="border-bottom: 2px solid ' + data_order.dentista_color + ';"   class=" fw-bold ">Dentista:   <span  style="color:' + data_order.dentista_color + ';"  class="fw-bold ">' + data_order.name_dentista + '</span></h4>'

            + '</div>'
            + '<div class="col-6" >'
            + '<h4 style="border-bottom: 2px solid ' + data_order.dentista_color + ';" class="text-start  fw-bold ">Folio:  <cite style="color:' + data_order.dentista_color + ';"  class="fw-bold">' + data_order.id_order + '</cite></h4>'
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
            + '<h5 class="p-0 m-0" style="color:' + data_order.dentista_color + ';">' + data_order.comentario.toUpperCase()  + '</h5>'
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



}


let clean_input = function () {
    $(".btn-check").prop("checked", false);
    $(".dentistas_name").val('');
    $(".paciente_name").val('');
    $(".date_salida").val(moment().format("DD-MM-YYYY")).datepicker({language: "es", format: "dd-mm-yyyy", startDate: 'd'});
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
        if ($(element).prop("checked") && $(element).attr("typeBtn") === typeBtn) {
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
            dentist_list.forEach(item => {
                $("#dentista_option").append(`<option id_dentista="${item._id}" value="${item.name_dentista}">${item.name_dentista}</option>`);
            });
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

    HoldOn.open(HoldOptions)
    api_conection('POST', 'api/orders/last_order/', {search}, function (data) {
        HoldOn.close()

        let order_data = data.data


        if (order_data.length < 1) {
            $('#dataLastOrder').hide()
            $('#NoDataLastOrder').show()

        } else {
            $('#dataLastOrder').show()
            $('#NoDataLastOrder').hide()
            for (let item of order_data) {


                if (item.regMor) {
                    $('#regMorLast').prop("checked", true)
                } else {
                    $('#regMorLast').prop("checked", false)

                }

                if (item.antagon) {
                    $('#antagonLast').prop("checked", true)
                } else {
                    $('#antagonLast').prop("checked", false)

                }


                $('#dentistaOrder').val(item.dentista)
                $('#Folio').text(item.folio)
                $('#searchOrders').val(item.folio)
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
                        button_edit = '<button colorEdit="' + jtem.detalle.color + '" folio="' + item.folio + '" productoEdit="' + jtem.detalle.producto.name_producto + '" dientesEdit="' + jtem.detalle.tooths + '" id_orden="' + item._id + '" id_detalle="' + jtem.detalle._id + '" class=" my-1 btn btn-warning  btn-block  edit_product btn_edit_' + jtem.detalle._id + '"><i class="fas fa-edit fa-rotate-270 fa-sm"></i></button>'
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
                        '<td><p>' + tooths_10_20 + '</p><p>' + tooths_30_40 + '</p></td>' +
                        '<td>' + jtem.detalle.color + '</td>' +
                        '<td>' + button_delete + button_edit + '</td></tr></table>'


                    $('#productos').append(row + '<div class="bg-dark py-1"></div>')


                }


            }
        }


    },)

}

let add_product = function (id_orden, folio) {

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

    $('#reload').click(function () {
        location.reload();
    })

})
