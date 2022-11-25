const json = require("body-parser/lib/types/json");
const express = require("express");
const router = express.Router();

let {
    new_product,
  data_table,
  
} = require("../controllers/products.controller");

//NUEVO PRODUCTO
router.post("/new_product", new_product);


//DATA PARA PINTAR EN DATATABLES
router.get("/data_dataTables/", data_table);

module.exports = router;
