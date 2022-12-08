const json = require("body-parser/lib/types/json");
const express = require("express");
const router = express.Router();

let {new_order,details_order} = require("../controllers/orders.controller.js")

//CREAR NUEVA ORDEN
router.post("/new_order/",new_order)

//DETALLE DE LA ORDEN
router.post("/details_order/:_id",details_order)

module.exports = router;
