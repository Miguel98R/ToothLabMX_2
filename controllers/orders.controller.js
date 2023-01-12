let ordersModel = require("../models/orden.model");
let detailsOrderModel = require("../models/detalle_orden.model");
let dentistModel = require("../models/dentisas.model");
let productModel = require("../models/productos.model");
let moment = require("moment");
let mongoose = require('mongoose')


let generate_id = function () {
    let today = moment().format("DDMMMYY");

    var letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    let numeroAleatorio = Math.floor(Math.random() * 100);

    let letraAleatoria = letras.charAt(Math.floor(Math.random() * letras.length));

    let string_id = letraAleatoria + numeroAleatorio + "-" + today;

    return string_id;
};

let new_order = async function (req, res) {
    let {new_order, new_order_details} = req.body;

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

let details_order = async function (req, res) {

    let {_id} = req.params

    try {

        let details_order = await ordersModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(_id),
                },
            },
            {
                $lookup: {
                    from: dentistModel.collection.name,
                    localField: 'dentista',
                    foreignField: '_id',
                    as: 'dentista'

                }
            },
            {
                $unwind: "$dentista"
            },
            {
                $lookup: {
                    from: detailsOrderModel.collection.name,
                    localField: 'detalle',
                    foreignField: '_id',
                    as: 'detalle'

                }
            },
            {
                $unwind: "$detalle"
            },
            {
                $lookup: {
                    from: productModel.collection.name,
                    localField: 'detalle.producto',
                    foreignField: '_id',
                    as: 'producto'

                }
            },
            {
                $unwind: "$producto"
            },
            {
                $replaceRoot: {
                    newRoot: {

                        id_order: "$id_order",
                        fecha_entrante: "$fecha_entrante",
                        fecha_saliente: "$fecha_saliente",
                        name_dentista: "$dentista.name_dentista",
                        dentista_color: "$dentista.distintivo_color",
                        name_paciente: "$name_paciente",
                        comentario: "$comentario",


                        color: "$detalle.color",
                        cantidad: "$detalle.cantidad",
                        tooths: "$detalle.tooths",
                        name_producto: "$producto.name_producto",
                        status: "$status",


                    }
                }
            }

        ])

        res.status(200).json({
            success: true,
            data: details_order
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: error
        })

    }

}

let pdf_generate = async function (req, res) {

    let id = req.params
    try {

        let html = '<h1>hola</h1>'


        res.status(200).json({
            success: true,
            message: 'pdf crado',

        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: error
        })
    }


}

let data_table = async function (req, res) {
    let {status_buscar} = req.params

    status_buscar = Number(status_buscar)
    try {
        let data_ordenes = await ordersModel.aggregate([
            {
                $match: {
                    status: status_buscar
                }
            },
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
                $replaceRoot: {
                    newRoot: {
                        _id: "$_id",
                        id_order: "$id_order",
                        fecha_entrada: "$fecha_entrante",
                        fecha_actualizacion: "$fecha_saliente",
                        dentista: "$dentista_detalle.name_dentista",
                        paciente: "$name_paciente",
                        status: "$status",
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

module.exports = {new_order, details_order, pdf_generate, data_table};
