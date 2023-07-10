const json = require("body-parser/lib/types/json");
const express = require("express");
const router = express.Router();

let {
    new_order,
    details_order,
    pdf_generate,
    data_table,
    change_status,
    add_product,
    delete_detail,
    edit_data_order,
    last_order,
    editProductDetail,
    orderByDentist,
    editTotalOrder,
    dt_historic,
    orderisPagada,
    orderPagadasByDentist
} = require("../controllers/orders.controller.js")


//CREAR NUEVA ORDEN
router.post("/new_order/", new_order)

//DETALLE DE LA ORDEN
router.post("/details_order/:_id", details_order)

//CREAR PDF
router.post("/pdf_generate/:id", pdf_generate)

//BUSCAR ORDENES POR STATUS PARA LAS DATATABLES DE LOS STATUS
router.get("/data_dataTables/:status_buscar", data_table);

//ACTUALIZAR EL STATUS DE LA ORDEN
router.put("/change_status/:id", change_status);

//AGREGAR NUEVO PRODUCTO A LA ORDEN
router.post("/add_product/:id", add_product);

//ELIMINAR DETALLE
router.post("/delete_detailsProduct/:id_detalle/:id_orden", delete_detail);

//EDITAR DATOS
router.put("/edit_data_order/:id_orden", edit_data_order);

//EDITAR PRODUCTO
router.put("/editProductDetail/:id_detalle", editProductDetail);

//ULTIMA ORDER
router.post("/last_order/", last_order);

//ORDENES NO PAGADAS POR DENTISTA

router.post("/orderByDentist/:id_dentista", orderByDentist);


//ORDENES PAGADAS POR DENTISTA

router.post("/orderPagadasByDentist/:id_dentista", orderPagadasByDentist);

//EDITAR TOTAL DE LA ORDEN

router.post("/editTotalOrder/", editTotalOrder);

//OBTENER HISTORICO DE ORDENES

router.post("/dt_historic/", dt_historic);

//CAMBIAR STATUS DE ORDEN A PAGADA

router.put("/orderisPagada/:id_order", orderisPagada);

module.exports = router;
