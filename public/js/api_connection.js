var notyf = new Notyf();



let api_conection = async function (method, url, data, f_, error_) {
    try {
        let response
        if (method == "GET") {
            response = await fetch(url,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                  
                    },
                    method: method,
                    //body: data ? JSON.stringify(data):""
                })
        } else {
            response = await fetch(url,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
       
                    },
                    method: method,
                    body: data ? JSON.stringify(data) : ""
                })
        }

        response = await response.json();

        if (response.success == true) {
            if (f_) {
                f_(response);
            }else{
                error_(response)
            }

        }
    } catch (e) {
        console.error(e);
        notify_error('Ocurrio un error verifique sus datos e intentelo nuevamente', e)
    }
}