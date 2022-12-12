

verificador();


$(document).ready(function () {
    
  let columns = [
    {
        width:"10%",
        data:"id_order",

    },
    {
        width:"15%",
        data:"fecha_entrada",
        render:function(data,v,row) {
          return moment(data,'DD-MM-YYYY').format('dddd DD-MMMM-YYYY')
          
        }

    },
    {
      width:"15%",
      data:"fecha_actualizacion",
      render:function(data,v,row) {
        return moment(data,'DD-MM-YYYY').format('dddd DD-MMMM-YYYY')
        
      }
  
    },
    { 
        width:"15%",
        data:"dentista"
    },
    {
         width:"5%",
        data:"paciente"
    },
    {
        width:"10%",
        data:"status",
        render:function(data,row){
          let status_text =  asignament_status(data)
          return  status_text
        }
    },
    {
        width:"5%",
        data:"_id",
        render:function(data,row){
            return '<button id_order="'+data+'" class="btn-sm btn-block text-white btn btn-info see_details">Ver detalles</button>'+
            '<button id_order="'+data+'"  class="btn-sm btn-block text-white btn btn-secondary my-2  imprimir_order">Imprimir</button>'
        }
    },
];

  let dt = $("#tbl-historial").DataTable({
    language: {
      lengthMenu: "Mostrar _MENU_ registros",
      zeroRecords: "No se encontraron resultados",
      info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
      infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
      infoFiltered: "(filtrado de un total de _MAX_ registros)",
      sSearch: "Buscar:",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
      sProcessing: "Procesando...",
    },
    initComplete: function () {
      $(this.api().table().container())
        .find("input")
        .parent()
        .wrap("<form>")
        .parent()
        .attr("autocomplete", "off");
    },

    data: [],

    lengthMenu: [
      [5, 10, 25, 50, 100, 1000],
      ["5", "10", "25", "50", "100", "1000"],
    ],

    order: [[1,'asc'],[2,'asc']],

    pageLength: 10,

    columns: columns,

    scrollY: 470,
    scrollX: true,
    scrollCollapse: true,
    paging: true,
    fixedHeader: true,
  });

  let data_historico;

  //DATA PARA PINTAR DATATABLES

  let dt_draw = function () {
    api_conection("GET", "api/historial/data_dataTables", {}, function (data) {
      data_historico = data.data;
      console.log("data_dataTables>>>>>>>>", data_historico);

      dt.clear();
      dt.rows.add(data_historico).draw();
    });
  };

  dt_draw()

  //DETALLES DE LA ORDEN

  $(document.body).on('click','.see_details',function(){

    let id_orden = $(this).attr('id_order')
    $('#detailsOrder_modal').modal('show')

    $('.details_general_order').html('')
    $('.details_product_order').html('')
    $('.comentario').html('')


    draw_modal_details(id_orden)

  })

  let draw_modal_details = function (id) {

    api_conection("POST", "api/orders/details_order/"+id, {}, function (data) {
      let data_order = data.data;
    
      console.log(data_order)

      for(let data_general of data_order){
        let status = asignament_status(data_general.status)

        console.log("-----------------",data_general)

       
        $('.details_general_order').append('<div>'

            +'<div class="row">'

                +'<div class="col-6">'
                  +'<p class="fw-bold">Folio: <span class="fw-normal"> '+ data_general.id_order+'</span></p>'
                  +'<p class="fw-bold">  Fecha de entrada: <span class="fw-normal">'+ moment(data_general.fecha_entrante,'DD-MM-YYYY').format('dddd DD-MMMM-YYYY')+'</span></p>'
                  +'<p class="fw-bold"> Fecha salida: <span class="fw-normal">'+  moment(data_general.fecha_saliente,'DD-MM-YYYY').format('dddd DD-MMMM-YYYY')+'</span></p>'
                
                        
                +'</div>'
                +'<div class="col-6">'
                    +'<p class="fw-bold">  Dentista: <span class="fw-normal">'+  data_general.name_dentista+'</span></p>'
                    +'<p class="fw-bold">  Paciente: <span class="fw-normal">'+  data_general.name_paciente+'</span></p>'
                    +'<p class="fw-bold">  Status: <span class="fw-normal">'+  status+'</span></p>'
                +'</div>'
             
            +'</div>'
          
        +'</div>')

        let tooths_10_20 = ''
        let tooths_30_40 = ''

          

        for(let od of data_general.tooths){

          let parrafo_od_10_20 = ''
          let parrafo_od_30_40 = ''


          od = Number(od)

          if(od >= 11 && od <= 18 ){
            parrafo_od_10_20 = '<span class="text-primary fs-5">'+od+'&nbsp;  </span>'
            

          }
          if(od >= 21 && od <= 28 ){
            parrafo_od_10_20 = '<span class="text-danger fs-5">'+od+'&nbsp;    </span>'

          }
          if(od >= 31 && od <= 38 ){
            parrafo_od_30_40 = '<span class="text-warning fs-5">'+od+'&nbsp;   </span>'

          }
          if(od >= 41 && od <= 48 ){
            parrafo_od_30_40 = '<span class="text-success fs-5">'+od+'&nbsp;   </span>'

          }

          tooths_10_20 = tooths_10_20 + parrafo_od_10_20
          tooths_30_40 = tooths_30_40 + parrafo_od_30_40
          
        }


        $('.details_product_order').append('<div class=""text-center>'
        +'<div class="row text-center">'
            +'<div class="col-3">'
              +'<p class="fw-bold">CANTIDAD</p>'
              
              +'<p class="fw-normal">' +data_general.cantidad+'</p>'
            +'</div>'
            +'<div class="col-6">'
                +'<p class="fw-bold">PRODUCTO</p>'
                

                +'<p class="fw-normal">' +data_general.name_producto+'</p>'
            +'</div>'
            +'<div class="col-3">'
                +'<p class="fw-bold">COLOR</p>'
                

                +'<p class="fw-normal">' +data_general.color+'</p>'
            +'</div>'
        +'</div>'

        +'<div class="col-12 text-center">'
               +'<p class="fw-bold">OD</p>'
               +tooths_10_20
               +'<br>'
               +tooths_30_40              
        +'</div>'

    +'</div>')




        $('.comentario').text(data_general.comentario)

      }

      
    });
    
  }

  $(document.body).on('click','.imprimir_order',function(){
    let id_orden = $(this).attr('id_orden')



    api_conection('POST','api/orders/pdf_generate/:id',{},function(){

    })
  })


});

