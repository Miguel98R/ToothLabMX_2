let dentistaModel = require("../models/dentisas.model");
const colorModel = require("../models/colores.model");



//DETALLES DEL DENTISTA
let details_dentist = async function (req, res) {
  let id = req.params;

  try {
    let dentista = await dentistaModel.findById(id);


    res.status(200).json({
      success: true,
      data: dentista,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      succes: false,
      error: e,
    });
  }
};

//CREAR NUEVO DENTISTA
let new_dentist = async function (req, res) {
  let nuevo_dentista = req.body;
 

  let dentisas = await dentistaModel.findOne({email_dentista:nuevo_dentista.email_dentista})

  if(dentisas){
    res.status(408).json({
      success: false,
      message: 'Este dentista ya existe , revise los datos',
    });

    return
  }

  try {
    let dentista = new dentistaModel({
      name_dentista: nuevo_dentista.name_dentista ? nuevo_dentista.name_dentista : 'S/R' ,
      domicilio_dentista:  nuevo_dentista.domicilio_dentista ? nuevo_dentista.domicilio_dentista : 'S/R' ,
      email_dentista:  nuevo_dentista.email_dentista ? nuevo_dentista.email_dentista : 'S/R' ,
      tel_dentista: nuevo_dentista.tel_dentista ? nuevo_dentista.tel_dentista : 'S/R' ,
      tel_consultorio: nuevo_dentista.tel_consultorio ? nuevo_dentista.tel_consultorio : 'S/R' ,
      distintivo_color: nuevo_dentista.distintivo_color ? nuevo_dentista.distintivo_color : 'S/R',
    });

    dentista.save();

    res.status(200).json({
      success: true,
      data: dentista,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      succes: false,
      error: e,
    });
  }
};

//INABILITAR DEL DENTISTA
let change_Status = async function (req, res) {
  let id = req.params;
  let { status } = req.body;
  let dentista;

  try {
    dentista = await dentistaModel.findById(id);

    if (status == "true") {
      dentista.status = false;
      dentista = dentista.save();
    } else {
      dentista.status = true;
      dentista = dentista.save();
    }

    res.status(200).json({
      success: true,
      data: dentista,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      succes: false,
      error: e,
    });
  }
};

//ACTUALIZAR DENTISTA
let update_dentista = async function (req, res) {
  let id = req.params;
  let { data_user } = req.body;
  let dentista;

  try {
    dentista = await dentistaModel.findById(id);

    dentista.name_dentista = data_user.name_dentista ? data_user.name_dentista : 'S/R'
    dentista.domicilio_dentista = data_user.domicilio_dentista ? data_user.domicilio_dentista : 'S/R'
    dentista.email_dentista = data_user.email_dentista ? data_user.email_dentista : 'S/R'
    dentista.tel_dentista = data_user.tel_dentista ? data_user.tel_dentista : 'S/R'
    dentista.tel_consultorio = data_user.tel_consultorio ? data_user.tel_consultorio : 'S/R'
    dentista.distintivo_color = data_user.distintivo_color ? data_user.distintivo_color : 'S/R'


    dentista = dentista.save()



    res.status(200).json({
      success: true,
      data: dentista,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      succes: false,
      error: e,
    });
  }
};

//DATA PARA DATATABLE
let data_table = async function (req, res) {
  try {
    let data_dentista = await dentistaModel.find();

    res.status(200).json({
      success: true,
      data: data_dentista,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

let top_5_dentist = async function (req,res) {

  try {
    let top_five = await dentistaModel.find({status:true}).limit(5).sort({cont_ordenes:-1})

  
    res.status(200).json({
      success:true,
      data:top_five
    })
    
  } catch (error) {
    console.log(error)

    res.status(500).json({
      success:false,
      error:error
    })
  }
  
}


//BUSCADOR DE DENTISTAS
let search_dentist = async function (req, res) {
  let {search} = req.body

  try {
    let dentistas = await dentistaModel.find({
      $and:[{status:true},{name_dentista:new RegExp(search,'i')}]  
    })

    res.status(200).json({
      success: true,
      data: dentistas,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      succes: false,
      error: e,
    });
  }
};

/*let script_insertDentistas = async function (req, res) {

  try {
    for(let item of dentistas){
      console.log(item)

      let dentista = new dentistaModel({
        name_dentista:item.name_dentista,
        distintivo_color:item.distintivo_color,
        status:item.status,
        domicilio_dentista:"S/R",
        email_dentista:"S/R",
        tel_dentista:"S/R",
        tel_consultorio:"S/R",



      })
      dentista = dentista.save()
    }

    res.status(200).json({
      success: true,
      data: []
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      succes: false,
      error: e,
    });
  }
};*/

module.exports = {
  new_dentist,
  data_table,
  details_dentist,
  change_Status,
  update_dentista,
  search_dentist,
  top_5_dentist,

};
