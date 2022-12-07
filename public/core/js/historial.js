verificador();


$(document).ready(function () {
    
  let columns = [
    {
        data:"id_order",

    },
    {
        data:"fecha_entrada",
     
        
    },{
        data:"fecha_actualizacion",
        
    },{
        data:"dentista"
    },{
        data:"paciente"
    },{
        data:"status",
        render:function(data,row){
            if(data == 1){
                return '<p class="text-dark"><b>Entrante</b></p>'

            }
        }
    },{
        data:"id_order",
        render:function(data,row){
            return '<button id_order="'+data+'" class="btn-sm text-white btn btn-info see_details">Ver detalles</button>'+
            '<button id_order="'+data+'"  class="btn-sm text-white btn btn-secondary mx-2 imprimir_order">Imprimir</button>'
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
      ["5 rows", "10 rows", "25 rows", "50 rows", "100 rows", "1000 rows"],
    ],

    order: [[1,'desc'],[3, "desc"]],

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
});

