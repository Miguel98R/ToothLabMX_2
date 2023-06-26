const json = require("body-parser/lib/types/json");
const express = require("express");
const router = express.Router();

let {
    new_color,
    edit_color,
    delete_color,
    dt_colores

} = require("../controllers/colores.controller");

//NUEVO COLOR
router.post("/new_color", new_color);

//EDITAR COLOR
router.post("/edit_color", edit_color);

//ELIMINAR COLOR
router.post("/delete_color", delete_color);

//DT COLOR
router.post("/dt_colores", dt_colores);


module.exports = router;
