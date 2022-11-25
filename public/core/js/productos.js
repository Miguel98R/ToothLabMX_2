verificador();

$(document).ready(function () {
  let columns = [
    {
      width: "30%",
      data: "name_producto",
    },
    {
      width: "10%",
      data: "precio",
      render:function(data,v,row){
        return "$ " + data + ".00"
      }
    },
    {
        width: "8%",
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
      width: "20%",
      data: "_id",
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

    order: [[1, "asc"]],

    pageLength: 5,

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














});
