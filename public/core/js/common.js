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
            status = '<span class="text-danger fw-bold">Cancelado</span>'
            break;
        case 7:
            status = '<span class="text-danger fw-bold">Cancelado con costo</span>'
            break;

    default:
         status = '<span class="text-danger">Error al cargar el status<span>'
         break;
  }



    return status
}




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

$(document).ready(function () {

$(document.body).on('click', '.out_session', function () {

    location.href = '/'
    localStorage.removeItem('TOKEN');
    
})

})
