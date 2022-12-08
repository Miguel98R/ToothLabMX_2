let ordersModel = require("../models/orden.model");
let detailsOrderModel = require("../models/detalle_orden.model");
let dentistModel = require("../models/dentisas.model");
let productModel = require("../models/productos.model");
let moment = require("moment");
let mongoose = require('mongoose')

let generate_id = function () {
  let today = moment().format("DDMMMYY");
  let result1 = Math.random().toString(36).substring(2, 4);
  let string_id = result1 + "-" + today;

  return string_id;
};

let new_order = async function (req, res) {
  let { new_order, new_order_details } = req.body;

  try {
    let id_detalle;

    //BUSCAR PRODUCTO PARA OBTENER ID Y ACTUALIZAR SU USO
    let product = await productModel.findOne({
      name_producto: new RegExp(new_order_details.producto_name, "i"),
    });

    //CREACION DEL DETALLE
    let details = new detailsOrderModel({
      cantidad: new_order_details.cantidad,
      color: new_order_details.color,
      producto: product._id,
      tooths: new_order_details.tooths,
    });

    details = await details.save();

    id_detalle = details._id;

    product.cuenta_uso = product.cuenta_uso + 1;
    product = await product.save();

    //SE INCREMENTA EL NUMERO DE ORDENES QUE SE A REALIZADO PARA EL DENTISTA
    let dentist = await dentistModel.findOne({
      name_dentista: new RegExp(new_order.dentista, "i"),
    });
    let id_dentista = dentist._id;

    dentist.cont_ordenes = dentist.cont_ordenes + 1;
    dentist = await dentist.save();

    let id = generate_id();

    //CREACION DE ORDER
    let order = new ordersModel({
      id_order: id,
      name_paciente: new_order.name_paciente,
      detalle: id_detalle,
      dentista: id_dentista,
      fecha_entrante: new_order.fecha_entrante,
      fecha_saliente: new_order.fecha_saliente,
      comentario: new_order.comentario,
    });

    order = await order.save();

    console.log("id order", order._id);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      error: e,
    });
  }
};

let details_order = async function (req,res){

  let {_id} = req.params

  try {

    let details_order = await ordersModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(_id),
        },
      },
      {
        $lookup:{
          from:dentistModel.collection.name,
          localField:'dentista',
          foreignField:'_id',
          as:'dentista'

        }
    },
    {
      $unwind: "$dentista"
    },
      {
          $lookup:{
            from:detailsOrderModel.collection.name,
            localField:'detalle',
            foreignField:'_id',
            as:'detalle'

          }
      },
      {
        $unwind: "$detalle"
      },
      {
        $lookup:{
          from:productModel.collection.name,
          localField:'detalle.producto',
          foreignField:'_id',
          as:'producto'

        }
    },
    {
      $unwind: "$producto"
    },
      
    ])

    res.status(200).json({
      success:true,
      data:details_order
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      error:error
    })
    
  }

}

module.exports = { new_order,details_order };
