const json = require("body-parser/lib/types/json");
const express = require("express");
const router = express.Router();

let {
    new_product,
    data_table,
    edit_product,
    change_Status,
    search_product,
    search_color,
    script_insertColors,
    top_5_products,
    productById


} = require("../controllers/products.controller");

//NUEVO PRODUCTO
router.post("/new_product", new_product);


//DATA PARA PINTAR EN DATATABLES
router.get("/data_dataTables/", data_table);

//ACTUALIZAR PRECIOS
router.put("/edit_product/:_id", edit_product);

//DATOS DEL PRODUCTO POR ID
router.post("/productById/:_id", productById);

//BUSCADOR DE PRODUCTOS
router.post("/search_product/", search_product);

//BUSCADOR DE COLORES
router.post("/search_color/", search_color);

//INABILITAR PRODUCTO
router.put("/change_Status/:_id", change_Status);

//TOP 5 MAS USADOS 
router.get("/top_5_products/", top_5_products);






module.exports = router;
