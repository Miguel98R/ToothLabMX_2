let dentistaModel = require("../models/dentisas.model");
const colorModel = require("../models/colores.model");

let dentistas = [
  {
    name_dentista: "MELY",
    distintivo_color:"#ff0000",
    status:true,

  },
  {
    name_dentista: "ANEEL",
    distintivo_color:"#276c12",
    status:true,
  },
  {
    name_dentista: "DULCE",
    distintivo_color:"#9a8d8d",
    status:true,
  },
  {
    name_dentista: "ISABEL",
    distintivo_color:"#62ecf1",
    status:true,
  },
  {
    name_dentista: "MIRYAM",
    distintivo_color:"#e5fb3c",
    status:true,
  },
  {
    name_dentista: "BRISA",
    distintivo_color:"#14616c",
    status:true,
  },
  {
    name_dentista: "KARLA",
    distintivo_color:"#804000",
    status:true,
  },
  {
    name_dentista: "SERVANDO",
    distintivo_color:"#14616c",
    status:true,
  },
  {
    name_dentista: "PATRICIA",
    distintivo_color:"#e18c47",
    status:true,
  },
  {
    name_dentista: "LAURA",
    distintivo_color:"#ffe747",
    status:true,
  },
  {
    name_dentista: "ROCIO",
    distintivo_color:"#ff9ffb",
    status:true,
  },
  {
    name_dentista: "LUIS",
    distintivo_color:"#800040",
    status:true,
  },
  {
    name_dentista: "MARISA",
    distintivo_color:"#000000",
    status:true,
  },
  {
    name_dentista: "MARYSOL",
    distintivo_color:"#fb4e04",
    status:true,
  },
  {
    name_dentista: "TERESA",
    distintivo_color:"#630b9d",
    status:true,
  },
  {
    name_dentista: "IRASEMA",
    distintivo_color:"#000000",
    status:true,
  },
  {
    name_dentista: "DELTA",
    distintivo_color:"#000000",
    status:true,
  },
  {
    name_dentista: "ENRIQUE",
    distintivo_color:"#a5fb3c",
    status:true,
  }
];

//DETALLES DEL DENTISTA
let details_dentist = async function (req, res) {
  let id = req.params;

  try {
    let dentista = await dentistaModel.findById(id);
    console.log("dentista----", dentista);

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
      name_dentista: nuevo_dentista.name_dentista,
      domicilio_dentista: nuevo_dentista.domicilio_dentista,
      email_dentista: nuevo_dentista.email_dentista,
      tel_dentista: nuevo_dentista.tel_dentista,
      tel_consultorio: nuevo_dentista.tel_consultorio,
      distintivo_color: nuevo_dentista.distintivo_color,
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

    dentista.name_dentista = data_user.name_dentista
    dentista.domicilio_dentista = data_user.domicilio_dentista
    dentista.email_dentista = data_user.email_dentista
    dentista.tel_dentista = data_user.tel_dentista
    dentista.tel_consultorio = data_user.tel_consultorio
    dentista.distintivo_color = data_user.distintivo_color

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

let script_insertDentistas = async function (req, res) {

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
};

module.exports = {
  new_dentist,
  data_table,
  details_dentist,
  change_Status,
  update_dentista,
  search_dentist,
  top_5_dentist,
  script_insertDentistas
};
