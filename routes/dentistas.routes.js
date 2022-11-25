const json = require("body-parser/lib/types/json");
const express = require("express");
const router = express.Router();

let {
  new_dentist,
  data_table,
  details_dentist,
  change_Status,
  update_dentista,
} = require("../controllers/dentistas.controller");

//NUEVO DENTISTA
router.post("/new_dentist", new_dentist);

//DETALLES POR DENTISTA
router.post("/details_dentist/:_id", details_dentist);

//CAMBIAR STATUS DEL DENTISTA
router.put("/change_Status/:_id", change_Status);

//ACTUALIZAR DATOS DEL DENTISTA
router.put("/update_dentista/:_id", update_dentista);

//DATA PARA PINTAR EN DATATABLES
router.get("/data_dataTables/", data_table);

module.exports = router;
