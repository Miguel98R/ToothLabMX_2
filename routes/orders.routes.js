const json = require("body-parser/lib/types/json");
const express = require("express");
const router = express.Router();

let {new_order,details_order,pdf_generate,data_table,change_status,add_product} = require("../controllers/orders.controller.js")


//CREAR NUEVA ORDEN
router.post("/new_order/",new_order)

//DETALLE DE LA ORDEN
router.post("/details_order/:_id",details_order)

//CREAR PDF
router.post("/pdf_generate/:id",pdf_generate)

//BUSCAR ORDENES POR STATUS PARA LAS DATATABLES DE LOS STATUS
router.get("/data_dataTables/:status_buscar", data_table);

//ACTUALIZAR EL STATUS DE LA ORDEN
router.put("/change_status/:id", change_status);

//AGREGAR NUEVO PRODUCTO A LA ORDEN
router.post("/add_product/:id", add_product);

module.exports = router;
