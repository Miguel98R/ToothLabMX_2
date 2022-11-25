let TOKEN_ = false
let DATA_ = false

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
        icon: '<i class="fas fa-exclamation"></i>'
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


var draw_datatable_rs = function (datatable) {
    datatable.clear().draw();
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
        console.log("response>>",response)

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
