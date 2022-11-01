let dentistaModel = require('../models/dentisas.model')

let apiato = require('apiato')

let ms = new apiato()



let new_dentist = async function (req, res) {
    
    let nuevo_dentista  = req.body
    console.log("nuevo_dentista>>>",nuevo_dentista)

   
    try {

        let dentista = new dentistaModel ({
            name_dentista : nuevo_dentista.name_dentista,
            domicilio_dentista : nuevo_dentista.domicilio_dentista,
            email_dentista : nuevo_dentista.email_dentista,
            tel_dentista : nuevo_dentista.tel_dentista,
            tel_consultorio : nuevo_dentista.tel_consultorio,
            distintivo_color : nuevo_dentista.distintivo_color,
            
        })


   

        dentista.save()
    
        res.status(200).json({
            success:true,
            data:dentista
     
        })
        
    } catch (e) {
        console.error(e)
        res.status(500).json({
            succes:false,
            error:e
            
        })
    }
    
    
}




//RECIBE (MODELO PRINCIPAL , AGREGACION , CAMPOS DE BUSQUEDA , )

//let data_table = ms.datatable_aggregate(dentistaModel)

let data_table = async function (req,res){
    try {

        let data_dentista = await dentistaModel.find()

        res.status(200).json({
            success:true,
            data:data_dentista
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            error:error
        })
        
    }
}

module.exports = { new_dentist , data_table }