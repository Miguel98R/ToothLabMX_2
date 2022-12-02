let productsModel = require("../models/productos.model");
let colorModel = require("../models/colores.model");

let colores = [
  {
    name_color: "A1",
  },
  {
    name_color: "A2",
  },
  {
    name_color: "A3",
  },
  {
    name_color: "A3.5",
  },
  {
    name_color: "A4",
  },
  {
    name_color: "B1",
  },
  {
    name_color: "B2",
  },
  {
    name_color: "B3",
  },
  {
    name_color: "B4",
  },
  {
    name_color: "C1",
  },
  {
    name_color: "C2",
  },
  {
    name_color: "C3",
  },
  {
    name_color: "C4",
  },
  {
    name_color: "D2",
  },
  {
    name_color: "D3",
  },
  {
    name_color: "D4",
  },
  {
    name_color: "62",
  },
  {
    name_color: "65",
  },
  {
    name_color: "66",
  },
  {
    name_color: "81",
  },
  {
    name_color: "Rosa Translucido",
  },
  {
    name_color: "Rosa Original",
  },
  {
    name_color: "R1 Nicotine",
  },
  {
    name_color: "R2 Nicotine",
  },
  {
    name_color: "Acrilico R2V Kemdent",
  },
  {
    name_color: "Acrilico 26 Pink Vein",
  },
  {
    name_color: "Acrilico Transparente",
  },
];



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









module.exports = {new_product , data_table ,precios_product ,change_Status,search_product,search_color,script_insertColors}