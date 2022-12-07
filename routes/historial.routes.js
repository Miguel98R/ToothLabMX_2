const json = require("body-parser/lib/types/json");
const express = require("express");
const router = express.Router();

let {data_table} = require("../controllers/historial.controller.js")

//DATA PARA PINTAR EN DATATABLES
router.get("/data_dataTables/", data_table);

module.exports = router;
