const json = require("body-parser/lib/types/json");
const express = require("express");
const router = express.Router();

let {
    new_product,
  data_table,
  precios_product,
  change_Status,
  
} = require("../controllers/products.controller");

//NUEVO PRODUCTO
router.post("/new_product", new_product);


//DATA PARA PINTAR EN DATATABLES
router.get("/data_dataTables/", data_table);

//ACTUALIZAR PRECIOS
router.put("/precios_product/:_id", precios_product);

//INABILITAR PRODUCTO
router.put("/change_Status/:_id", change_Status);

module.exports = router;
