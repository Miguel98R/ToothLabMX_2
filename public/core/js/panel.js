verificador()

$(document).ready(function() {


    let top_5_dentistas = function(){

        $('.top_5_dentistas').html('')

        api_conection('GET','api/dentist/top_5_dentist/',{},function (data) {


            let dentisas_top = data.data

            for(let item of dentisas_top ){

                $('.top_5_dentistas').append('<div class="col-12 my-2 border-bottom border-dark">'
            
                    +'<small class="fw-bold"style="color:'+item.distintivo_color +';">'+item.name_dentista+'</small>'
                    +'<br><mark style="color:'+item.distintivo_color +';">'+item.email_dentista+'</mark>'

                    +'<br><small>Total de ordenes: '+item.cont_ordenes+'</small>'
        
                +'</div>')
                
            }
          
          
           
        })

    }

    let top_5_prducts = function(){

        $('.top_5_productos').html('')

        api_conection('GET','api/products/top_5_products/',{},function (data) {


            let dentisas_top = data.data

            for(let item of dentisas_top ){

                $('.top_5_productos').append('<div class="col-12 my-2 py-2 border-bottom border-dark">'
            
                    +'<small class="my-2 fw-bold">'+item.name_producto+'</small>'
                    +'<br>'

                    +'<mark class="my-3">Total usado: '+item.cuenta_uso+'</mark>'
                    +'<br>'
        
                +'</div>')
                
            }
          
          
           
        })

    }
    
top_5_dentistas()
top_5_prducts()

})