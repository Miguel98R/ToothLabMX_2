

verificador()

$(document).ready(function () {



let columns = [
    {
        data:"_id"
    },
    {
        data:"name_dentista"
    },
    {
        data:"domicilio_dentista"
    },
    {
        data:"_id",
        render : function(data,v,row){
            return ''
        }
    },
    {
        data:"distintivo_color",
        render : function(data,v,row){
            return ''
        }
    },
    {
        data:"status",
    },
    {
        data:"_id",
        render : function(data,v,row){
            return ''
        }
    },

]

dt = $('#tbl_dentistas').DataTable({

    initComplete: function () {
        $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
    },

    "data": [],

    lengthMenu: [
        [5, 10, 25, 50, 100, 1000],
        ['5 rows', '10 rows', '25 rows', '50 rows', '100 rows', '1000 rows']
    ],

    "order": [[1,'asc']],

    pageLength: 5,

    "columns": columns,
 
    scrollY:        470,
    scrollX:        true,
    scrollCollapse: true,
    paging:         true,
    fixedHeader:    true,

  

})

let data_dentista

let dt_draw =  function (){
  
    api_conection('GET','api/dentist/data_dataTables', {},function (data) {

        data_dentista = data.data
        console.log("data_dataTables>>>>>>>>", data_dentista)
       
        dt.clear()
        dt.rows.add(data_dentista).draw()

    })

}

dt_draw()


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
            draw_DT()

         })

 
     })
 
   
 
 })
 