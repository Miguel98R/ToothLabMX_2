verificador();

$(document).ready(function () {
  let columns = [
    {
      width: "30%",
      data: "name_producto",
    },
    {
      width: "15%",
      data: "precio",
      render:function(data,v,row){
        return '<span>$ </span><input style="width:70%;" id_producto="'+row._id+'" class="change_precio precio_product_'+row._id+' m-0 p-0" value="'+data+'"></input>'
      }
    },
    {
        width: "5%",
        data: "status",
        render: function (data, v, row) {
          if (data == true) {
            return '<p class="text-success">Activo</p>';
          } else {
            return '<p class="text-danger">Inactivo</p>';
          }
        },
      },
    {
      width: "5%",
      data: "cuenta_uso",
    },
   
    {
      width: "15%",
      data: "_id",
      render: function (data, v, row) {
        if (row.status) {
          return '<button status="true" id_product="' +
            data +
            '" class="btn btn-danger btn-sm change_status my-2 mx-2 ">Inabilitar</button>'
          
        } else {
          return '<button  status="false" id_product="' +data +
            '" class="btn btn-success btn-sm change_status my-2 mx-2 ">Habilitar</button>'
          
        }
      },
    },
  ];

  dt = $("#tbl_productos").DataTable({
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

    order: [[3, "desc"]],

    pageLength: 10,

    columns: columns,

    scrollY: 470,
    scrollX: true,
    scrollCollapse: true,
    paging: true,
    fixedHeader: true,
  });

  let data_producto;

  //DATA PARA PINTAR DATATABLES

  let dt_draw = function () {
    api_conection("GET", "api/products/data_dataTables", {}, function (data) {
      data_producto = data.data;
      console.log("data_dataTables>>>>>>>>", data_producto);

      dt.clear();
      dt.rows.add(data_producto).draw();
    });
  };

  dt_draw();

  //ABRIR MODAL PARA CREAR NUEVO PRODUCTO
  $(".open_modal_new_producto").click(function () {
    $("#name_product").val("");
    $("#precio_producto").val("");

    $("#new_product_modal").modal("show");
  });

//CREACION DE NUEVO PRODUCTO

let new_dentist;

$('.new_product').click(function () {
  let nombre = $("#name_product").val();
  
  let precio = $("#precio_producto").val();

  if (nombre == "" || nombre == undefined) {
    notyf.error("ingresa el nombre del producto");
    return 0;
  }

  if (precio == "" || precio == undefined) {
    notyf.error("ingresa el precio del producto");
    return 0;
  }

  nuevo_producto = {
    name_producto: nombre,
    precio: precio,
  };

  api_conection(
    "POST",
    "api/products/new_product",
    nuevo_producto,
    function (data) {
      notyf.success("Producto creado !");
      dt_draw();
    }
  );
});

//Actualizar precio del producto
$(document.body).on("change",".change_precio",function(){

  let id_producto = $(this).attr("id_producto")
  let precio = $('.precio_product_'+id_producto).val()

  api_conection("PUT","api/products/precios_product/"+id_producto,{precio},function(){

    notyf.success("Precio actualizado !");

    dt_draw();

  })

})




    // CAMBIAR STATUS 

    $(document.body).on("click", ".change_status", function () {
      let _id = $(this).attr("id_product");
      let status = $(this).attr("status");
  
      api_conection(
        "PUT",
        "api/products/change_Status/" + _id,
        { status },
        function () {
          notyf.success("Status actualizado !");
  
          dt_draw();
        }
      );
    });






});
