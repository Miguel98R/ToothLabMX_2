verificador();



$(document).ready(function () {
  $(".date_entrada").datepicker();
  $(".date_salida").datepicker();

  let search = "";

  let drawOptionsDentist = function (search) {
    api_conection(
      "POST",
      "api/dentist/search_dentist",
      { search },
      function (data) {
        let dentist_list = data.data;
        for (let item of dentist_list) {
          $("#dentista_option").append(
            '<option id_dentista="' +
              item._id +
              '" value="' +
              item.name_dentista +
              '">' +
              item.name_dentista +
              "</option>"
          );
        }
      }
    );
  };

  let drawOptionsProducto = function (search) {
    api_conection(
      "POST",
      "api/products/search_product",
      { search },
      function (data) {
        let products_list = data.data;
        for (let item of products_list) {
          $("#producto_option").append(
            '<option id_product="' +
              item._id +
              '" value="' +
              item.name_producto +
              '">' +
              item.name_producto +
              "</option>"
          );
        }
      }
    );
  };


  let drawOptionsColor = function (search) {
    api_conection(
      "POST",
      "api/products/search_colors",
      { search },
      function (data) {
        let colors_list = data.data;
        for (let item of colors_list) {
          $("#color_option").append(
            '<option id_product="' +
              item._id +
              '" value="' +
              item.name_color +
              '">' +
              item.name_color +
              "</option>"
          );
        }
      }
    );
  };

  drawOptionsDentist(search);
  drawOptionsProducto(search);

});
