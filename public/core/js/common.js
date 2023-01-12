let TOKEN_ = false
let DATA_ = false

moment.locale('es');  
/**
 * Spanish translation for bootstrap-datepicker
 * Bruno Bonamin <bruno.bonamin@gmail.com>
 */
 ;(function($){
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



let verificador =  function () {

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
        }else{
            if(error_){
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
        console.log("data_dataTables>>>>>>>>", data_query);

        data_table.clear();
        data_table.rows.add(data_query).draw();
    });
};


let asignament_status = function(status_order){

    let status = ''

    switch (status_order) {
        case 1:
            status = '<span class="text-primary fw-bold">Entrante</span>'
            break;
        case 2:
            status = '<span class="text-warning fw-bold">Prueba</span>'
            break;
        case 3:
            status =  '<span class="text-secondary fw-bold">Regresado</span>'
            break;
        case 4:
            status = '<span class="text-success fw-bold">Terminado</span>'
            break;
        case 5:
            status =  '<span class="text-info fw-bold">Cambios</span>'
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

    api_conection("POST", "api/orders/details_order/" + id, {}, function (data) {
        let data_order = data.data;

        console.log(data_order)

        for (let data_general of data_order) {
            let status = asignament_status(data_general.status)


            $('.details_general_order').append('<div>'

                + '<div class="row">'

                + '<div class="col-6">'
                + '<p class="fw-bold">Folio: <span class="fw-normal"> ' + data_general.id_order + '</span></p>'
                + '<p class="fw-bold">  Fecha de entrada: <span class="fw-normal">' + moment(data_general.fecha_entrante, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</span></p>'
                + '<p class="fw-bold"> Fecha salida: <span class="fw-normal">' + moment(data_general.fecha_saliente, 'DD-MM-YYYY').format('dddd DD-MMMM-YYYY') + '</span></p>'


                + '</div>'
                + '<div class="col-6">'
                + '<p class="fw-bold">  Dentista: <span class="fw-normal">' + data_general.name_dentista + '</span></p>'
                + '<p class="fw-bold">  Paciente: <span class="fw-normal">' + data_general.name_paciente + '</span></p>'
                + '<p class="fw-bold">  Status: <span class="fw-normal">' + status + '</span></p>'
                + '</div>'

                + '</div>'

                + '</div>')

            let tooths_10_20 = ''
            let tooths_30_40 = ''


            for (let od of data_general.tooths) {

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


            $('.details_product_order').append('<div class=""text-center>'
                + '<div class="row text-center">'
                + '<div class="col-3">'
                + '<p class="fw-bold">CANTIDAD</p>'

                + '<p class="fw-normal">' + data_general.cantidad + '</p>'
                + '</div>'
                + '<div class="col-6">'
                + '<p class="fw-bold">PRODUCTO</p>'


                + '<p class="fw-normal">' + data_general.name_producto + '</p>'
                + '</div>'
                + '<div class="col-3">'
                + '<p class="fw-bold">COLOR</p>'


                + '<p class="fw-normal">' + data_general.color + '</p>'
                + '</div>'
                + '</div>'

                + '<div class="col-12 text-center">'
                + '<p class="fw-bold">OD</p>'
                + tooths_10_20
                + '<br>'
                + tooths_30_40
                + '</div>'

                + '</div>')


            $('.comentario').text(data_general.comentario)

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

$(document).ready(function () {

$(document.body).on('click', '.out_session', function () {

    location.href = '/'
    localStorage.removeItem('TOKEN');
    
})

})
