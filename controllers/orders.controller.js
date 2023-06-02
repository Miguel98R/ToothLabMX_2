let ordersModel = require("../models/orden.model");
let detailsOrderModel = require("../models/detalle_orden.model");
let dentistModel = require("../models/dentisas.model");
let productModel = require("../models/productos.model");
let moment = require("moment");
let mongoose = require('mongoose')


//GENEAR ID PARA ORDENES
let generate_id = function (lastid) {

    console.log(lastid)
    let newId = Number(lastid) + 1


    return newId;
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

        let lastOrder = await ordersModel.find().sort({id_order: -1}).limit(1)


        let lastid


        for (let item of lastOrder) {
            lastid = Number(item.id_order)
        }


        let id = generate_id(lastid);

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
            regMor: new_order.regMor,
            antagon: new_order.antagon,
        });

        console.log(order)

        order = await order.save();


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
                        regMor: "$regMor",
                        antagon: "$antagon",
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
            data_details.regMor = item.regMor
            data_details.antagon = item.antagon


        }
        for (let item of order_products) {
            data_details.products = item.products


        }


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
                        regMor: "$regMor",
                        antagon: "$antagon",
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

//EDITAR PRODUCTO
let editProductDetail = async function (req, res) {

    let {id_detalle} = req.params
    let {body} = req.body


    try {

        let product = await productModel.findOne({
            name_producto: new RegExp(body.producto_name, "i"),
        });

        product.cuenta_uso = product.cuenta_uso + 1;
        product = await product.save();


        let id_producto = product._id;

        let detalle = await detailsOrderModel.findById(id_detalle)

        detalle.producto = id_producto
        detalle.color = body.color
        detalle.tooths = body.tooths
        detalle.cantidad = body.cantidad

        await detalle.save()

        res.status(200).json({
            success: true,
            message: "Producto editado "
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Error al editar el producto",
            success: false,
            error: e
        })
    }
}


//EDITAR DATOS
let edit_data_order = async function (req, res) {

    let {body} = req.body

    let {id_orden} = req.params

    try {


        let order = await ordersModel.findById(id_orden)
        let id_dentista

        if (!body.name_paciente) {
            order.dentista = order.dentista

        } else {
            let dentist = await dentistModel.findOne({
                name_dentista: new RegExp(body.dentista, "i"),
            });

            dentist.cont_ordenes = dentist.cont_ordenes + 1;
            dentist = await dentist.save();

            order.dentista = dentist._id;


        }


        body.name_paciente != undefined ? order.name_paciente = body.name_paciente : order.name_paciente = order.name_paciente
        body.fecha_entrante != undefined ? order.fecha_entrante = body.fecha_entrante : order.fecha_entrante = order.fecha_entrante
        body.fecha_saliente != undefined ? order.fecha_saliente = body.fecha_saliente : order.fecha_saliente = order.fecha_saliente
        body.comentario != undefined ? order.comentario = body.comentario : order.comentario = order.comentario
        body.antagon != undefined ? order.antagon = body.antagon : order.antagon = order.antagon
        body.regMor != undefined ? order.regMor = body.regMor : order.regMor = order.regMor


        await order.save()


        res.status(200).json({
            success: true,
            message: "Datos actualizados"
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

    let {search} = req.body


    try {
        let order
        if (search == undefined || search == '') {
            order = await ordersModel.aggregate([
                {
                    $lookup: {
                        from: dentistModel.collection.name,
                        localField: 'dentista',
                        foreignField: '_id',
                        as: 'dentista'
                    }
                },
                {
                    $unwind: '$dentista'
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
                    $unwind: '$detalle'
                },
                {
                    $lookup: {
                        from: productModel.collection.name,
                        localField: 'detalle.producto',
                        foreignField: '_id',
                        as: 'detalle.producto'
                    }
                },
                {
                    $unwind: '$detalle.producto'
                },
                {
                    $group: {
                        _id: {
                            paciente: '$name_paciente',
                            dentista: '$dentista.name_dentista',
                            fecha_entrante: '$fecha_entrante',
                            fecha_saliente: '$fecha_saliente',
                            folio: '$id_order',
                            comentario: '$comentario',
                            _id: '$_id',
                            status: '$status',
                            regMor: '$regMor',
                            antagon: '$antagon',
                            createdAt: '$createdAt'
                        },
                        items: {
                            $push: {
                                detalle: '$detalle',
                            }
                        }
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            paciente: '$_id.paciente',
                            dentista: '$_id.dentista',
                            fecha_entrante: '$_id.fecha_entrante',
                            fecha_saliente: '$_id.fecha_saliente',
                            folio: '$_id.folio',
                            comentario: '$_id.comentario',
                            _id: '$_id._id',
                            status: '$_id.status',
                            regMor: '$_id.regMor',
                            antagon: '$_id.antagon',
                            createdAt: '$_id.createdAt',
                            detalle: '$items'
                        }
                    }

                },

                {
                    $sort: {
                        'createdAt': -1
                    }
                },

            ]).limit(1)
        } else {
            order = await ordersModel.aggregate([
                {
                    $match: {
                        id_order: Number(search)
                    }
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
                    $unwind: {
                        path: '$dentista',
                        preserveNullAndEmptyArrays: true,
                    },
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
                    $unwind: {
                        path: "$detalle",
                        preserveNullAndEmptyArrays: true,
                    },
                },

                {
                    $lookup: {
                        from: productModel.collection.name,
                        localField: 'detalle.producto',
                        foreignField: '_id',
                        as: 'detalle.producto'
                    }
                },
                {
                    $unwind: {
                        path: '$detalle.producto',
                        preserveNullAndEmptyArrays: true,
                    },
                },

                {
                    $group: {
                        _id: {
                            paciente: '$name_paciente',
                            dentista: '$dentista.name_dentista',
                            fecha_entrante: '$fecha_entrante',
                            fecha_saliente: '$fecha_saliente',
                            folio: '$id_order',
                            comentario: '$comentario',
                            _id: '$_id',
                            status: '$status',
                            regMor: '$regMor',
                            antagon: '$antagon',
                            createdAt: '$createdAt'
                        },
                        items: {
                            $push: {
                                detalle: '$detalle',
                            }
                        }
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            paciente: '$_id.paciente',
                            dentista: '$_id.dentista',
                            fecha_entrante: '$_id.fecha_entrante',
                            fecha_saliente: '$_id.fecha_saliente',
                            folio: '$_id.folio',
                            comentario: '$_id.comentario',
                            _id: '$_id._id',
                            status: '$_id.status',
                            regMor: '$_id.regMor',
                            antagon: '$_id.antagon',
                            createdAt: '$_id.createdAt',
                            detalle: '$items'
                        }
                    }

                },

                {
                    $sort: {
                        'createdAt': -1
                    }
                },


            ])

        }


        if (order == null) {
            res.status(404).json({
                success: false,
                data: order,
                message: 'No has registrado ordenes'
            })
            return
        }

        res.status(200).json({
            success: true,
            data: order
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

//OBTENER ORDEN POR DENTISTA
let orderByDentist = async function (req, res) {

    let {id_dentista} = req.params


    try {
        let order

        order = await ordersModel.aggregate([
            {
                $match: {
                    dentista: mongoose.Types.ObjectId(id_dentista)
                }
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
                $unwind: '$dentista'
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
                $unwind: '$detalle'
            },
            {
                $lookup: {
                    from: productModel.collection.name,
                    localField: 'detalle.producto',
                    foreignField: '_id',
                    as: 'detalle.producto'
                }
            },
            {
                $unwind: '$detalle.producto'
            },
            {
                $group: {
                    _id: {
                        paciente: '$name_paciente',
                        total_order: '$total_order',
                        fecha_entrante: '$fecha_entrante',
                        folio: '$id_order',
                        status: '$status',
                        dentista_color: "$dentista.distintivo_color",
                        id_dentista: "$dentista._id",
                        _id: "$_id",

                    },
                    items: {
                        $push: {
                            detalle: '$detalle',
                        }
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        paciente: '$_id.paciente',
                        total_order: '$_id.total_order',
                        fecha_entrante: '$_id.fecha_entrante',
                        folio: '$_id.folio',
                        status: '$_id.status',
                        createdAt: '$_id.createdAt',
                        detalle: '$items',
                        dentista_color: '$_id.dentista_color',
                        id_dentista: '$_id.id_dentista',
                        _id: '$_id._id',
                    }
                }

            },

            {
                $sort: {
                    'createdAt': -1
                }
            },

        ])


        if (order == null) {
            res.status(404).json({
                success: false,
                data: order,
                message: 'No has registrado ordenes'
            })
            return
        }

        res.status(200).json({
            success: true,
            data: order
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


//EDITAR EL TOTAL DE LA ORDEN
let editTotalOrder = async function (req, res) {

    let body = req.body


    try {
        let order = await ordersModel.findById(body.id_order)

        if (order == null) {
            res.status(404).json({
                success: false,
                data: order,
                message: 'No existe la orden'
            })
            return
        }

        order.total_order = Number(body.value)
        await order.save()

        res.status(200).json({
            success: true,
            message: 'Total actualizado'
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Error al actualizar total de la orden ",
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
    last_order,
    editProductDetail,
    orderByDentist,
    editTotalOrder
};

