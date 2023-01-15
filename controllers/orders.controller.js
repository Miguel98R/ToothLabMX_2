let ordersModel = require("../models/orden.model");
let detailsOrderModel = require("../models/detalle_orden.model");
let dentistModel = require("../models/dentisas.model");
let productModel = require("../models/productos.model");
let moment = require("moment");
let mongoose = require('mongoose')


//GENEAR ID PARA ORDENES
let generate_id = function () {
    let today = moment().format("DDMMMYY");

    var letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    let numeroAleatorio = Math.floor(Math.random() * 100);

    let letraAleatoria = letras.charAt(Math.floor(Math.random() * letras.length));

    let string_id = letraAleatoria + numeroAleatorio + "-" + today;

    return string_id;
};
//CREAR NUEVA ORDEN
let new_order = async function (req, res) {
    let {new_order, new_order_details} = req.body;

    try {

        let productsArray = []
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

        productsArray.push(details._id)

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
            detalle: productsArray,
            dentista: id_dentista,
            fecha_entrante: new_order.fecha_entrante,
            fecha_actualizacion: new_order.fecha_entrante,
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
//DETALLE DE LA ORDEN
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
                $replaceRoot: {
                    newRoot: {
                        _id: "$_id",
                        id_order: "$id_order",
                        fecha_entrante: "$fecha_entrante",
                        fecha_saliente: "$fecha_saliente",
                        name_dentista: "$dentista.name_dentista",
                        dentista_color: "$dentista.distintivo_color",
                        name_paciente: "$name_paciente",
                        comentario: "$comentario",
                        status: "$status"

                    }
                }
            },
        ])

        let order_products = await ordersModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(_id),
                },
            },
            {
                $lookup: {
                    from: detailsOrderModel.collection.name,
                    localField: 'detalle',
                    foreignField: '_id',
                    as: 'detalle'
                },
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
                        _id: "$_id",
                        id_detalle: "$detalle._id",
                        color: "$detalle.color",
                        cantidad: "$detalle.cantidad",
                        tooths: "$detalle.tooths",
                        name_producto: "$producto.name_producto",


                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    products: {
                        $push: {
                            id_detalle: "$id_detalle",
                            color: "$color",
                            cantidad: "$cantidad",
                            tooths: "$tooths",
                            name_producto: "$name_producto",

                        }
                    }

                }
            },
            {
                $replaceRoot: {
                    newRoot: {

                        products: "$products"

                    }
                }
            }
        ])

        let data_details = {}
        for (let item of details_order) {
            data_details._id = item._id
            data_details.id_order = item.id_order
            data_details.fecha_entrante = item.fecha_entrante

            data_details.fecha_entrada = item.fecha_entrada
            data_details.fecha_saliente = item.fecha_saliente
            data_details.name_dentista = item.name_dentista
            data_details.dentista_color = item.dentista_color
            data_details.name_paciente = item.name_paciente
            data_details.comentario = item.comentario
            data_details.status = item.status


        }
        for (let item of order_products) {
            data_details.products = item.products


        }
        console.log(data_details)


        res.status(200).json({
            success: true,
            data: data_details
        })

    } catch
        (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: error
        })

    }

}
//GENERAR PDF
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
//INFORMACION PARA MOSTRAR EN LA DATATABLE
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
                        fecha_saliente: "$fecha_saliente",
                        fecha_actualizacion: "$fecha_actualizacion",
                        dentista: "$dentista_detalle.name_dentista",
                        distintivo_color: "$dentista_detalle.distintivo_color",
                        paciente: "$name_paciente",
                        status: "$status",
                    }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    items: {
                        $last: '$$ROOT'
                    }
                }
            }, {
                $replaceRoot: {
                    newRoot: "$items"
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
//ACTUALIZAR STATUS DE LA ORDEN
let change_status = async function (req, res) {
    let {id} = req.params
    let {status} = req.body
    try {

        let order_data = await ordersModel.findById(id)
        order_data.status = status
        order_data.fecha_actualizacion = moment().format('DD-MM-YYYY')

        order_data = order_data.save()

        res.status(200).json({
            success: true,
            message: 'Status actualizado'
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'Error al actualizar status',
            error: e
        })
    }
}
//AGREGAR NUEVO PRODUCTO A LA ORDEN
let add_product = async function (req, res) {
    let {id} = req.params
    let {new_product} = req.body

    console.log(id)
    console.log(new_product)

    try {

        let id_detalle;

        //BUSCAR PRODUCTO PARA OBTENER ID Y ACTUALIZAR SU USO
        let product = await productModel.findOne({
            name_producto: new RegExp(new_product.producto_name, "i"),
        });

        //CREACION DEL DETALLE
        let details = new detailsOrderModel({
            cantidad: new_product.cantidad,
            color: new_product.color,
            producto: product._id,
            tooths: new_product.tooths,
        });

        console.log(details)

        details = await details.save();

        id_detalle = details._id;

        product.cuenta_uso = product.cuenta_uso + 1;
        product = await product.save();

        //BUSCAR ORDEN PARA AGREGAR EL NUEVO PRODUCTO
        let order_data = await ordersModel.findById(id)

        let products_actuales = order_data.detalle
        products_actuales.push(id_detalle)
        order_data.detalle = products_actuales

        order_data.fecha_actualizacion = moment().format('DD-MM-YYYY')

        order_data = order_data.save()

        res.status(200).json({
            success: true,
            message: 'Producto agregado'
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'Error al agregar producto',
            error: e
        })
    }
}
//ELIMINAR DETALE
let delete_detail = async function (req, res) {

    let {id_detalle} = req.params
    let {id_orden} = req.params

    console.log(id_detalle)
    console.log(id_orden)

    try {
        let array_ordenDetails

        let order = await ordersModel.findById(id_orden)
        array_ordenDetails = order.detalle

        array_ordenDetails = array_ordenDetails.filter((item) => item != id_detalle)

        order.detalle = array_ordenDetails

        order = await order.save()

        let detalle = await detailsOrderModel.findByIdAndDelete(id_detalle)

        res.status(200).json({
            success: true,
            message: "Producto eliminado correctamente"
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Error al eliminar el producto",
            success: false,
            error: e
        })
    }
}

//TODO: ACTUALIZAR ESTE ENDPOINT PARA QUE ACTUALICE TODOS LOS DATOS //
//EDITAR DATOS
let edit_data_order = async function (req, res) {
//    let {new_data_order} = req.body

    let {comentarios} = req.body
    let {id_orden} = req.params

    try {


        let order = await ordersModel.findById(id_orden)
        order.comentario = comentarios
        order = order.save()


        res.status(200).json({
            success: true,
            message: "Comentarios actualizados"
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Error al actualizar ",
            success: false,
            error: e
        })
    }
}

//OBTENER ULTIMA ORDEN CREADA
let last_order = async function (req, res) {

    try {


        let order = await ordersModel.findOne().sort({createdAt:-1}).limit(1)
        console.log(order)


        res.status(200).json({
            success: true,
            data:order
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Error al consultar ultima orden ",
            success: false,
            error: e
        })
    }
}
module.exports = {
    new_order,
    details_order,
    pdf_generate,
    data_table,
    change_status,
    add_product,
    delete_detail,
    edit_data_order,
    last_order
};
