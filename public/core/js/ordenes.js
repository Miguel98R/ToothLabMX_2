


verificador();

$(document).ready(function () {

  let today = moment().format("DD/MM/YYYY")

  $(".date_entrada").datepicker(
    { language: "es", setDate: new Date(), }).val(today);

  $(".date_salida").datepicker({language: 'es'});

  let search = "";


  $('.saved_order').click(function() {
    
    let tooths = $('.btn-check')
    let dentist = $('.dentistas_name').val()
    let name_paciente = $('.paciente_name').val()
    let fecha_entrada = $('.date_entrada').val()
    let fecha_salida = $('.date_salida').val()
    let cantidad = $('.count_tooths').text()
    let producto_name = $('.producto_name').val()
    let color_name = $('.color_name').val()
    let comentario = $('.comntario_order').val()

    let tooths_array = []
    let new_order = {}
    let new_order_details = {}


    if(dentist == '' || dentist == undefined){
      notyf.open({type:'warning',message:'Seleccione el dentista'})
      return
    }

    if(producto_name == '' || producto_name == undefined){
      notyf.open({type:'warning',message:'Seleccione el producto'})
      return
    }

    if(color_name == '' || color_name == undefined){
      notyf.open({type:'warning',message:'Seleccione el color'})
      return
    }

    tooths.each((i,element) => {
      if($(element).prop('checked') == true ){
        let value = $(element).val()
        tooths_array.push(value)
      }
  
    })

    new_order.name_paciente = name_paciente
    new_order.dentista = dentist
    new_order.fecha_entrante = fecha_entrada
    new_order.fecha_saliente = fecha_salida
    new_order.comentario = comentario

    new_order_details.cantidad = cantidad
    new_order_details.color = color_name
    new_order_details.tooths = tooths_array
    new_order_details.producto_name = producto_name

   

console.log(new_order)
console.log(new_order_details)



   api_conection('POST','api/orders/new_order',{new_order,new_order_details},function(data) {

    let data_order = data.data
    notyf.success('Orden  '+data_order.id_order+'  creada con exito')
    clean_input()
    
   })

   let clean_input = function(){

    $('.btn-check').prop('checked',false)

   }





    
  })


$('.btn-check').click(function () {
  
  let tooths = $('.btn-check')

  let contador_tooths = 0

  tooths.each((i,element) => {
    if($(element).prop('checked') == true ){
      contador_tooths++
    }

  })

$('.count_tooths').text(contador_tooths)


})


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
      "api/products/search_color",
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
  drawOptionsColor(search);


});
