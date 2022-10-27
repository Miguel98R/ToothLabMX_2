

verificador()

$(document).ready(function () {

    //abrir modal para crear dentistas
    $(document.body).on('click','.open_modal',function(){
       
     $('#name_dentist').val('')
     $('#direccion_dentist').val('')
     $('#tel_dentista').val('')
     $('#tel_consultorio').val('')
     $('#distintivo_dentista').val('')
     $('#email_dentist').val('')
     
     $('#new_dentista_modal').modal('show')
 
       
    })
 


    //creacion de nuevo dentista

    let new_dentist
 
    $(document.body).on('click','.new_dentist',function(){
 
         let nombre  = $('#name_dentist').val()
         let direccion = $('#direccion_dentist').val()
         let cel_dentista = $('#tel_dentista').val()
         let cel_consultorio = $('#tel_consultorio').val()
         let distintivo_color = $('#distintivo_dentista').val()
         let email = $('#email_dentist').val()
 
         if(nombre == ''  || nombre == undefined){
             notyf.error('ingresa el nombre')
             return 0
         }
 
         if(distintivo_color == ''  || distintivo_color == undefined){
             notyf.error('ingresa el distintivo')
             return 0
         }
 
 
         nuevo_dentista = {
             name_dentista : nombre,
             domicilio_dentista : direccion,
             tel_dentista : cel_dentista,
             tel_consultorio : cel_consultorio,
             distintivo_color : distintivo_color,
             email_dentista : email,
 
         }
 
         
         api_conection('POST', 'api/dentist/new_dentist', nuevo_dentista , function (data) {

            notyf.success('Dentista creado !')

         })

 
     })
 
   
 
 })
 