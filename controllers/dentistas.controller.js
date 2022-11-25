let dentistaModel = require("../models/dentisas.model");

// let apiato = require("apiato");

// let ms = new apiato();

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
  console.log("nuevo_dentista>>>", nuevo_dentista);

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

//RECIBE (MODELO PRINCIPAL , AGREGACION , CAMPOS DE BUSQUEDA , )

//let data_table = ms.datatable_aggregate(dentistaModel)

module.exports = {
  new_dentist,
  data_table,
  details_dentist,
  change_Status,
  update_dentista,
};
