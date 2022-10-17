const mongoose = require('mongoose')
let Schema = mongoose.Schema


let productoSchema = new Schema ({

    name_producto:{
        type:String,
        required:true
    },
    precio:{
        type:String,
        required:false

    },
    cuenta_uso:{
        type:Number,
        required:false
    },
    
    status:{
        type:Boolean,
        required:true,
        default:1 //activo 1 , inactivo 0
    }
},{timestamps: true})



module.exports = new mongoose.model('productos', productoSchema)
