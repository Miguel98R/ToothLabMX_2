let productsModel = require("../models/productos.model");


//CREAR NUEVO PRODUCTO
let new_product = async function (req, res) {
    let nuevo_producto = req.body;
    console.log("nuevo_producto>>>", nuevo_producto);
  
    try {
      let producto = new productsModel({
        name_producto: nuevo_producto.name_producto,
        precio: nuevo_producto.precio,
       
      });
  
      producto.save();
  
      res.status(200).json({
        success: true,
        data: producto,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        succes: false,
        error: e,
      });
    }
  };


  //DATA PARA DATATABLE
let data_table = async function (req, res) {
    try {
      let data_producto = await productsModel.find();
  
      res.status(200).json({
        success: true,
        data: data_producto
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error: error,
      });
    }
  };
  






module.exports = {new_product , data_table}