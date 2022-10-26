
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
            
           
            
            respuesta = response.data
            codigo = response.code
            token = response.tokenSession

            localStorage.setItem('TOKEN',token)


            if(codigo==200){

               
          async function validate (){

           let  response  =  fetch('/panel',
                        {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'authorization': 'Bearer ' + localStorage.getItem('TOKEN') || false
                        
                            },
                            method: 'GET',
                        
                        })
                        
                        if (response) {
                   
                            location.href = '/panel'
                        } else {
                            notyf('Ocurrio un error verifique sus datos e intentelo nuevamente')
                        }
                
                    notyf.success("Inicio correcto")



               } 
             
               validate()

            }


    },function(response){

        codigo = response.code 

         
        if(codigo==403){
            contra_++
           
            notyf.error(response.message)
            
            if(contra_>2){
                $('#reset_password').show()
            }else{
                $('#reset_password').css( "display", "none" );
            }

        

        }

        if(codigo==404){
            user_++

            notyf.error(response.message)

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