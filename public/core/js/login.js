
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

    
        api_conection('POST', 'api/auth/login', { user, password }, function (response) {
            
            console.log("data>>>>",response)
            
            respuesta = response.data
            codigo = response.code

            console.log(respuesta)
            console.log(codigo)



            if(codigo==200){

                notyf.success("Inicio correcto")

               setTimeout(() => {
                 location.href = '/panel'
               }, 1003);
                    
               

            }

            if(codigo==404){
                contra_++
                notyf.error(respuesta)

                
                if(contra_>2){
                    $('#reset_password').show()
                }else{
                    $('#reset_password').css( "display", "none" );
                }

            

            }

            if(codigo==403){
                user_++

                notyf.error(respuesta)

                $('#reset_user').show()

                 
                if(user_>2){
                    $('#reset_user').show()
                }else{
                    $('#reset_user').css( "display", "none" );
                }
                  

               

            }
           

    })


    })


    $(document.body).on('click','.reset_constra',function (){
        $('#reset_contra_modal').modal('show')
        contra_ = 0
        $('#reset_password').css( "display", "none" );
    
        

    })

    $(document.body).on('click','.reset_user',function (){
        $('#reset_user_modal').modal('show')
        user_ = 0
        $('#reset_user').css( "display", "none" );
    })









})