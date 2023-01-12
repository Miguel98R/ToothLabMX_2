$(document).ready(function () {

    let count = []
    let contra_ = 0
    let user_ = 0

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

        api_conection('POST', 'api/auth/login', {user, password}, function (response) {

            let respuesta = response.data
            let codigo = response.code
            let token = response.tokenSession


            if (codigo == 200) {

                localStorage.setItem('TOKEN', token)
                
                    location.href = '/panel'
            }

        }, function (response) {

            let codigo = response.code


            if (codigo == 403) {
                contra_++
                if (contra_ > 2) {
                    $('#reset_password').show()
                } else {
                    $('#reset_password').css("display", "none");
                }
            }

            if (codigo == 404) {
                user_++
                $('#reset_user').show()

                if (user_ > 2) {
                    $('#reset_user').show()
                } else {
                    $('#reset_user').css("display", "none");
                }
            }
        })
    })

    $(document.body).on('click', '.reset_constra', function () {
        $('#reset_contra_modal').modal('show')
        contra_ = 0
        $('#reset_password').css("display", "none");


    })

    $(document.body).on('click', '.reset_user', function () {
        $('#reset_user_modal').modal('show')
        user_ = 0
        $('#reset_user').css("display", "none");
    })

    $(".new_user").click(function () {
        let user = $('.user_name').val()
        let password = $('.user_password').val()
        let rol = 'admin'

        api_conection('POST','/api/auth/registrer/',{user,password,rol},function (response) {
            notyf.success(response.message)

        })

    })



})

