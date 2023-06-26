let colorModel = require("../models/colores.model");

//CREAR NUEVO COLOR
let new_color = async function (req, res) {
    let newcolor = req.body;

    try {
        let color = new colorModel({
            name_producto: newcolor.name_producto,

        });

        await color.save();

        res.status(200).json({
            success: true,
            message: "color creado"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            succes: false,
            error: e,
        });
    }
};


//EDITAR COLOR
let edit_color = async function (req, res) {
    let {id} = req.params;
    let name_color = req.body

    try {
        let color = await colorModel.findById(id)

        color.name_color = name_color


        await color.save();

        res.status(200).json({
            success: true,
            message: "Color actualizado"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            succes: false,
            error: e,
        });
    }
};


//ELIMINAR COLOR
let delete_color = async function (req, res) {
    let {id} = req.params;

    try {
        let color = await colorModel.findByIdAndDelete(id)


        res.status(200).json({
            success: true,
            message: "Color eliminado"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            succes: false,
            error: e,
        });
    }
};

//DT COLOR
let dt_colores = async function (req, res) {
    let {id} = req.params;

    try {
        let color = await colorModel.findByIdAndDelete(id)


        res.status(200).json({
            success: true,
            message: "Color eliminado"
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
    new_color,
    edit_color,
    delete_color,
    dt_colores
}