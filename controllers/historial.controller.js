let ordersModel = require("../models/orden.model");
let detailsOrderModel = require("../models/detalle_orden.model");
let dentistModel = require("../models/dentisas.model");
let productModel = require("../models/productos.model");

//DATA PARA DATATABLE
let data_table = async function (req, res) {
  try {
    let data_ordenes = await ordersModel.aggregate([
      {
        $lookup: {
          from: detailsOrderModel.collection.name,
          localField: "detalle",
          foreignField: "_id",
          as: "detalle_orden",
        },
      },
      {
        $unwind: "$detalle_orden",
      },
      {
        $lookup: {
          from: dentistModel.collection.name,
          localField: "dentista",
          foreignField: "_id",
          as: "dentista_detalle",
        },
      },
      {
        $unwind: "$dentista_detalle",
      },
      {
        $lookup: {
          from: productModel.collection.name,
          localField: "detalle_orden.producto",
          foreignField: "_id",
          as: "producto_detalle",
        },
      },
      {
        $unwind: "$producto_detalle",
      },
      {
        $replaceRoot:{
            newRoot:{
                id_order:"$id_order",
                fecha_entrada:"$fecha_entrante",
                fecha_actualizacion:"$fecha_saliente",
                dentista:"$dentista_detalle.name_dentista",
                paciente:"$name_paciente",
                status:"$status",
            }
        }
      }
    ]);

    console.log(data_ordenes);

    res.status(200).json({
      success: true,
      data: data_ordenes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

module.exports = { data_table };
