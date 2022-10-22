

$(document).ready(function () {

    $('#entrar').click(function () {
        let user = $('#user').val()
        let password = $('#password').val()

        if (user == '' || user == undefined) {
            notyf.error('ingrese el usuario')
            return 0
        }

        if (password == '' || password == undefined) {
            notyf.error('ingrese la contraseña')
            return 0
        }

        let data_user
        let count = 0
       
        api_conection('POST', 'api/auth/login', { user, password }, function (data) {
            console.log("SI paso",data.data)
            data_user = data.data

            notyf.success("Inicio correcto")

            setTimeout(() => {
                location.href = '/panel'
            }, 1000);

            

           

        },function(data){
            console.log("error",data.data)
            notyf.error(data.data)

            $('#entrar').click(function(){
                $('.reset_password').html('')
                count++
              
                console.log(count)
                if(count >= 2 && data.data == 'Contraseña incorrecta'){
                   
                    $('.reset_password').show()
                    $('.reset_password').append('<button class="btn btn-default reset_contra">¿ Olvidaste tu contraseña ?</button>')
                }

                if(count >= 2 && data.data == 'Usuario incorrecto'){
                   
                    $('.reset_password').show()
                    $('.reset_password').append('<button class="btn btn-default reset_user">Crear nuevo usuario</button>')
                }
            })

            return 0
        })

        $(document.body).on('click','.reset_contra',function(){
            alert('recuperacion de contrseña')
        })

        $(document.body).on('click','.reset_user',function(){
            alert('recuperacion de contrseña')
        })


    })






















})