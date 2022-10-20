$(document).ready(function () {

$('#entrar').click(function(){
    let user = $('#user').val()
    let password = $('#password').val()

    if(user == '' || user == undefined){
        notyf.error('ingrese el usuario')
        return 0
    }

    if(password == '' || password == undefined){
        notyf.error('ingrese la contraseña')
        return 0
    }

    console.log('user>>',user)
    console.log('password>>',password)
let data_user
    api_conection('POST','api/auth/login',{user,password},function(data){
        console.log(data.data)

data_user = data.data



        
        
        
        
   
    })


})

})