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
            data: color,
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
    new_color
}