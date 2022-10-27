let dentistaModel = require('../models/dentisas.model')


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


        console.log(dentista)

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

module.exports = { new_dentist }