verificador();

$(document).ready(function () {

    $('.date_entrada').datepicker();
    $('.date_salida').datepicker();


  
    let search = ''

    let drawOptionsDentist = function(search){
        api_conection("POST","api/dentist/search_dentist",{search},function(data){

            let dentist_list = data.data
            for(let item of dentist_list){

                $("#dentista_option").append('<option id_dentista="'+item._id+'" value="'+item.name_dentista+'">'+item.name_dentista+'</option>')


            }
            

        })

    }

    drawOptionsDentist(search)
});
