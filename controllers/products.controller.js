let productsModel = require("../models/productos.model");
let colorModel = require("../models/colores.model");

//CREAR NUEVO PRODUCTO
let new_product = async function (req, res) {
    let nuevo_producto = req.body;
   
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
  
//ACTUALIZAR PRECIOS

let precios_product = async function (req, res) {

  let id = req.params
  let {precio} = req.body



  try {

    let product = await productsModel.findById(id)

    product.precio = precio

    product = product.save()

    res.status(200).json({
      success:true,
      data:product
    })
    
  } catch (e) {
    console.log(e)
    res.status(500).json({
      success:false,
      error:e
    })
    
  }
  
}

//INABILITAR PRODUCTO

let change_Status = async function (req, res) {

  let id = req.params
  let {status} = req.body

  console.log(id)
  console.log(status)


  try {

    let product = await productsModel.findById(id)
    
    if (status == "true") {
      product.status = false;
      product = product.save();
    } else {
      product.status = true;
      product = product.save();
    }

    res.status(200).json({
      success:true,
      data:product
    })
    
  } catch (e) {
    console.log(e)
    res.status(500).json({
      success:false,
      error:e
    })
    
  }
  
}





//BUSCADOR DE PRODUCTOS
let search_product = async function (req, res) {
  let {search} = req.body

  try {
    let products = await productsModel.find({
      $and:[{status:true},{name_producto:new RegExp(search,'i')}]
    })

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      succes: false,
      error: e,
    });
  }
};

//BUSCADOR DE COLORES
let search_color = async function (req, res) {
  let {search} = req.body

  try {
    let colors = await colorModel.find({name_color:new RegExp(search,'i')})

    res.status(200).json({
      success: true,
      data: colors,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      succes: false,
      error: e,
    });
  }
};


let top_5_products = async function (req,res) {

  try {
    let top_five = await productsModel.find({status:true}).limit(5).sort({cuenta_uso:-1})

  
    res.status(200).json({
      success:true,
      data:top_five
    })
    
  } catch (error) {
    console.log(error)

    res.status(500).json({
      success:false,
      error:error
    })
  }
  
}





//SCRIPT_CRACION DE COLORES
let script_insertColors = async function (req, res) {
 

  try {
    for(let item of colores){
      console.log(item)

      let colores = new colorModel({
        name_color:item.name_color
        
      })
      colores = colores.save()
    }

    res.status(200).json({
      success: true,
      data: []
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      succes: false,
      error: e,
    });
  }
};









module.exports = {new_product , data_table ,precios_product ,change_Status,search_product,search_color,script_insertColors,top_5_products}